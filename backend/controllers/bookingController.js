const { db } = require('../config/db');

// Helper to wrap db.query in a promise
const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { trainId, travelDate, numberOfTickets, passengers, classId } = req.body;
        const tickets = Number(numberOfTickets) || 1;
        const userId = req.user.user_id || req.user._id;

        // Fetch train
        const trainRes = await query('SELECT * FROM trains WHERE train_id = ?', [trainId]);
        if (trainRes.length === 0) {
            return res.status(404).json({ message: 'Train not found' });
        }
        const train = trainRes[0];

        // Fetch class
        const classRes = await query('SELECT * FROM train_classes WHERE class_id = ? AND train_id = ?', [classId, trainId]);
        if (classRes.length === 0) {
            return res.status(400).json({ message: 'Invalid class selected for this train' });
        }
        const selectedClass = classRes[0];

        if (selectedClass.available_seats < tickets) {
            return res.status(400).json({ message: 'Not enough seats available in this class' });
        }

        const totalPrice = selectedClass.price * tickets;
        
        // Generate random PNR
        const pnr = "RAI" + Math.floor(100000 + Math.random() * 900000);

        const seatNumbers = [];
        const startSeat = selectedClass.total_seats - selectedClass.available_seats + 1;
        for (let i = 0; i < tickets; i++) {
            seatNumbers.push(startSeat + i);
        }
        const seatNumbersStr = seatNumbers.join(',');

        // Insert booking
        const bookingRes = await query(
            'INSERT INTO bookings (pnr, user_id, train_id, travel_date, number_of_tickets, seat_numbers, total_price, status, class_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [
                pnr, userId, trainId, travelDate, tickets, seatNumbersStr, totalPrice, 'Confirmed', classId
            ]
        );
        const bookingId = bookingRes.insertId;

        // Insert passengers
        if (passengers && Array.isArray(passengers)) {
            for (const p of passengers) {
                await query(
                    'INSERT INTO passengers (booking_id, name, age, gender) VALUES (?, ?, ?, ?)',
                    [bookingId, p.name, p.age, p.gender]
                );
            }
        }

        // Update class seats
        await query(
            'UPDATE train_classes SET available_seats = available_seats - ? WHERE class_id = ?', 
            [tickets, classId]
        );

        // Return created booking
        const createdBookingRes = await query('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);
        const createdBooking = createdBookingRes[0];
        
        // Format for frontend (array for seats, camelCase props, _id for booking_id)
        res.status(201).json({
            ...createdBooking,
            _id: createdBooking.booking_id,
            travelDate: createdBooking.travel_date,
            numberOfTickets: createdBooking.number_of_tickets,
            seatNumbers,
            totalPrice: createdBooking.total_price,
            classId: createdBooking.class_id,
            classType: selectedClass.class_type,
            status: createdBooking.status,
            trainId: trainId,
            userId: userId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:id
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Inner join with trains and classes
        const sql = `
            SELECT b.*, t.train_name, t.train_number, t.source, t.destination, t.departure_time, t.arrival_time, tc.class_type
            FROM bookings b
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            WHERE b.user_id = ?
            ORDER BY b.booking_id DESC
        `;
        
        const results = await query(sql, [userId]);
        
        // Format for frontend
        const formattedBookings = results.map(row => ({
            _id: row.booking_id,
            pnr: row.pnr,
            travelDate: row.travel_date,
            numberOfTickets: row.number_of_tickets,
            seatNumbers: row.seat_numbers ? row.seat_numbers.split(',').map(Number) : [],
            totalPrice: row.total_price,
            classType: row.class_type,
            status: row.status,
            trainId: {
                _id: row.train_id,
                trainName: row.train_name,
                trainNumber: row.train_number,
                source: row.source,
                destination: row.destination,
                departureTime: row.departure_time,
                arrivalTime: row.arrival_time,
                price: row.price
            }
        }));
        
        // Fetch and attach passengers
        if (formattedBookings.length > 0) {
            const bookingIds = formattedBookings.map(b => b._id);
            const passengersRes = await query(`SELECT * FROM passengers WHERE booking_id IN (${bookingIds.join(',')})`);
            const passengersByBooking = {};
            passengersRes.forEach(p => {
                if (!passengersByBooking[p.booking_id]) passengersByBooking[p.booking_id] = [];
                passengersByBooking[p.booking_id].push({ name: p.name, age: p.age, gender: p.gender });
            });
            formattedBookings.forEach(b => {
                b.passengers = passengersByBooking[b._id] || [];
            });
        }
        
        res.json(formattedBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        // Multi-join simulating populate('userId'), populate('trainId'), populate('classId')
        const sql = `
            SELECT b.*, 
                   tc.class_type,
                   t.train_name, t.train_number, t.source, t.destination,
                   u.name as user_name, u.email as user_email
            FROM bookings b
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN users u ON b.user_id = u.user_id
            ORDER BY b.booking_id DESC
        `;
        
        const results = await query(sql);
        
        const formattedBookings = results.map(row => ({
            _id: row.booking_id,
            pnr: row.pnr,
            travelDate: row.travel_date,
            numberOfTickets: row.number_of_tickets,
            seatNumbers: row.seat_numbers ? row.seat_numbers.split(',').map(Number) : [],
            totalPrice: row.total_price,
            classType: row.class_type,
            status: row.status,
            trainId: {
                _id: row.train_id,
                trainName: row.train_name,
                trainNumber: row.train_number,
                source: row.source,
                destination: row.destination
            },
            userId: {
                _id: row.user_id,
                name: row.user_name,
                email: row.user_email
            }
        }));

        // Fetch and attach passengers
        if (formattedBookings.length > 0) {
            const bookingIds = formattedBookings.map(b => b._id);
            const passengersRes = await query(`SELECT * FROM passengers WHERE booking_id IN (${bookingIds.join(',')})`);
            const passengersByBooking = {};
            passengersRes.forEach(p => {
                if (!passengersByBooking[p.booking_id]) passengersByBooking[p.booking_id] = [];
                passengersByBooking[p.booking_id].push({ name: p.name, age: p.age, gender: p.gender });
            });
            formattedBookings.forEach(b => {
                b.passengers = passengersByBooking[b._id] || [];
            });
        }

        res.json(formattedBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        const sql = `
            SELECT b.*,
                   tc.class_type,
                   t.train_name, t.train_number, t.source, t.destination, t.departure_time, t.arrival_time,
                   u.name as user_name, u.email as user_email
            FROM bookings b
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_id = ?
        `;
        
        const results = await query(sql, [bookingId]);
            
        if (results.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        const row = results[0];
        const reqUserId = req.user.user_id || req.user._id;

        // Ensure user is authorized to view this booking
        if (row.user_id.toString() !== reqUserId.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to view this booking' });
        }
        
        const formattedBooking = {
            _id: row.booking_id,
            pnr: row.pnr,
            travelDate: row.travel_date,
            numberOfTickets: row.number_of_tickets,
            seatNumbers: row.seat_numbers ? row.seat_numbers.split(',').map(Number) : [],
            totalPrice: row.total_price,
            classType: row.class_type,
            status: row.status,
            trainId: {
                _id: row.train_id,
                trainName: row.train_name,
                trainNumber: row.train_number,
                source: row.source,
                destination: row.destination,
                departureTime: row.departure_time,
                arrivalTime: row.arrival_time
            },
            userId: {
                _id: row.user_id,
                name: row.user_name,
                email: row.user_email
            }
        };
        
        // Fetch passengers
        const passengersRes = await query('SELECT * FROM passengers WHERE booking_id = ?', [formattedBooking._id]);
        formattedBooking.passengers = passengersRes.map(p => ({
            name: p.name,
            age: p.age,
            gender: p.gender
        }));
        
        res.json(formattedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        const results = await query('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = results[0];
        const reqUserId = req.user.user_id || req.user._id;

        if (booking.user_id.toString() !== reqUserId.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to cancel this booking' });
        }
        
        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Cancel booking
        await query('UPDATE bookings SET status = "Cancelled" WHERE booking_id = ?', [bookingId]);

        // Restore seats
        if (booking.class_id) {
            await query('UPDATE train_classes SET available_seats = available_seats + ? WHERE class_id = ?', 
                [booking.number_of_tickets, booking.class_id]
            );
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking by PNR
// @route   GET /api/bookings/pnr/:pnr
// @access  Public
const getBookingByPNR = async (req, res) => {
    try {
        const pnr = req.params.pnr;
        
        const sql = `
            SELECT b.*,
                   tc.class_type,
                   t.train_name, t.train_number, t.source, t.destination, t.departure_time, t.arrival_time,
                   u.name as user_name, u.email as user_email
            FROM bookings b
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.pnr = ?
        `;
        
        const results = await query(sql, [pnr]);
            
        if (results.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        const row = results[0];
        
        const formattedBooking = {
            _id: row.booking_id,
            pnr: row.pnr,
            travelDate: row.travel_date,
            numberOfTickets: row.number_of_tickets,
            seatNumbers: row.seat_numbers ? row.seat_numbers.split(',').map(Number) : [],
            totalPrice: row.total_price,
            classType: row.class_type,
            status: row.status,
            trainId: {
                _id: row.train_id,
                trainName: row.train_name,
                trainNumber: row.train_number,
                source: row.source,
                destination: row.destination,
                departureTime: row.departure_time,
                arrivalTime: row.arrival_time
            },
            userId: {
                _id: row.user_id,
                name: row.user_name,
                email: row.user_email
            }
        };
        
        // Fetch passengers
        const passengersRes = await query('SELECT * FROM passengers WHERE booking_id = ?', [formattedBooking._id]);
        formattedBooking.passengers = passengersRes.map(p => ({
            name: p.name,
            age: p.age,
            gender: p.gender
        }));
        
        res.json(formattedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings, getBookingByPNR };
