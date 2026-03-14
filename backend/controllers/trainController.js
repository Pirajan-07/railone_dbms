const { db } = require('../config/db');

// Helper to wrap db.query in a promise
const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

// Helper function to map DB snake_case to Frontend camelCase
const mapTrainToFrontend = (train) => ({
    _id: train.train_id,
    trainName: train.train_name,
    trainNumber: train.train_number,
    trainType: train.train_type,
    source: train.source,
    destination: train.destination,
    departureTime: train.departure_time,
    arrivalTime: train.arrival_time
});

// @desc    Fetch all trains / search trains 
// @route   GET /api/trains 
// @access  Public
const getTrains = async (req, res) => {
    try {
        const { source, destination } = req.query;
        let sql = 'SELECT * FROM trains';
        let params = [];

        if (source && destination) {
            sql = 'SELECT * FROM trains WHERE source LIKE ? AND destination LIKE ?';
            params = [`%${source}%`, `%${destination}%`];
        }

        const trainsRes = await query(sql, params);
        
        // Fetch classes for all trains to get starting price
        const classesRes = await query('SELECT * FROM train_classes');
        const classesMap = {};
        classesRes.forEach(c => {
            if (!classesMap[c.train_id]) classesMap[c.train_id] = [];
            classesMap[c.train_id].push({
                classId: c.class_id,
                classType: c.class_type,
                price: c.price,
                availableSeats: c.available_seats
            });
        });

        // Map to frontend compatibility
        const trains = trainsRes.map(t => {
            const mapped = mapTrainToFrontend(t);
            const tClasses = classesMap[t.train_id] || [];
            if (tClasses.length > 0) {
                mapped.price = Math.min(...tClasses.map(cls => cls.price));
                mapped.availableSeats = tClasses.reduce((acc, cls) => acc + cls.availableSeats, 0);
            } else {
                mapped.price = 0;
                mapped.availableSeats = 0;
            }
            return mapped;
        });

        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single train
// @route   GET /api/trains/:id 
// @access  Public
const getTrainById = async (req, res) => {
    try {
        const trainsRes = await query('SELECT * FROM trains WHERE train_id = ?', [req.params.id]);
        
        if (trainsRes.length > 0) {
            const train = mapTrainToFrontend(trainsRes[0]);
            
            // Fetch routes
            const routesRes = await query('SELECT * FROM train_routes WHERE train_id = ? ORDER BY stop_number', [train._id]);
            train.routes = routesRes.map(r => ({
                stationName: r.station_name,
                stopNumber: r.stop_number
            }));
            
            // Fetch classes
            const classesRes = await query('SELECT * FROM train_classes WHERE train_id = ?', [train._id]);
            train.classes = classesRes.map(c => ({
                classId: c.class_id,
                classType: c.class_type,
                totalSeats: c.total_seats,
                availableSeats: c.available_seats,
                price: c.price
            }));
            
            if (train.classes.length > 0) {
                train.price = Math.min(...train.classes.map(cls => cls.price));
                train.availableSeats = train.classes.reduce((acc, cls) => acc + cls.availableSeats, 0);
            } else {
                train.price = 0;
                train.availableSeats = 0;
            }
            
            res.json(train);
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a train 
// @route   POST /api/trains 
// @access  Private/Admin
const createTrain = async (req, res) => {
    try {
        // Handle incoming camelCase from frontend
        const { trainName, trainNumber, source, destination, departureTime, arrivalTime, totalSeats, price } = req.body;
        
        const sql = `
            INSERT INTO trains 
            (train_name, train_number, source, destination, departure_time, arrival_time, total_seats, available_seats, price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [trainName, trainNumber, source, destination, departureTime, arrivalTime, totalSeats, totalSeats, price]; // available starts = total
        
        const insertResult = await query(sql, params);
        
        // Fetch created train to return
        const newTrain = await query('SELECT * FROM trains WHERE train_id = ?', [insertResult.insertId]);
        res.status(201).json(mapTrainToFrontend(newTrain[0]));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a train 
// @route   PUT /api/trains/:id 
// @access  Private/Admin
const updateTrain = async (req, res) => {
    try {
        const trainId = req.params.id;
        const trainData = req.body; // camelCase from frontend
        
        // Check if train exists
        const trainsRes = await query('SELECT * FROM trains WHERE train_id = ?', [trainId]);
        
        if (trainsRes.length > 0) {
            const train = trainsRes[0];
            
            // Map camelCase keys to snake_case keys
            const keyMap = {
                trainName: 'train_name',
                trainNumber: 'train_number',
                source: 'source',
                destination: 'destination',
                departureTime: 'departure_time',
                arrivalTime: 'arrival_time',
                totalSeats: 'total_seats',
                availableSeats: 'available_seats',
                price: 'price'
            };

            const updates = [];
            const values = [];
            
            for (const [key, value] of Object.entries(trainData)) {
                if (keyMap[key]) {
                    updates.push(`${keyMap[key]} = ?`);
                    values.push(value);
                }
            }
            
            if (updates.length > 0) {
                values.push(trainId);
                const updateSql = `UPDATE trains SET ${updates.join(', ')} WHERE train_id = ?`;
                await query(updateSql, values);
                
                // Fetch updated train
                const updatedTrainRes = await query('SELECT * FROM trains WHERE train_id = ?', [trainId]);
                res.json(mapTrainToFrontend(updatedTrainRes[0]));
            } else {
                 res.json(mapTrainToFrontend(train)); // nothing updated
            }
            
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a train 
// @route   DELETE /api/trains/:id 
// @access  Private/Admin
const deleteTrain = async (req, res) => {
    try {
        const trainId = req.params.id;
        const trainsRes = await query('SELECT * FROM trains WHERE train_id = ?', [trainId]);
        
        if (trainsRes.length > 0) {
            await query('DELETE FROM trains WHERE train_id = ?', [trainId]);
            res.json({ message: 'Train removed' });
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTrains, getTrainById, createTrain, updateTrain, deleteTrain };
