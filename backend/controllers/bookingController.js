const Booking = require('../models/Booking');
const Train = require('../models/Train');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { trainId, travelDate, numberOfTickets } = req.body;
        
        const tickets = Number(numberOfTickets) || 1;

        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ message: 'Train not found' });
        }

        if (train.availableSeats < tickets) {
            return res.status(400).json({ message: `Only ${train.availableSeats} seats available` });
        }

        const seatNumbers = [];
        const startSeat = train.totalSeats - train.availableSeats + 1;
        for (let i = 0; i < tickets; i++) {
            seatNumbers.push(startSeat + i);
        }

        const totalPrice = train.price * tickets;

        const pnr = "RAI" + Math.floor(100000 + Math.random() * 900000);

        const booking = new Booking({
            pnr,
            userId: req.user._id,
            trainId,
            travelDate,
            numberOfTickets: tickets,
            seatNumbers,
            totalPrice,
            status: 'Booked'
        });

        const createdBooking = await booking.save();
        
        train.availableSeats -= tickets;
        await train.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:id
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.id }).populate('trainId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('userId', 'name email').populate('trainId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('trainId')
            .populate('userId', 'name email');
            
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Ensure user is authorized to view this booking
        if (booking.userId._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to view this booking' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to cancel this booking' });
        }
        
        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        const train = await Train.findById(booking.trainId);
        if (train) {
            train.availableSeats += booking.numberOfTickets;
            await train.save();
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings };
