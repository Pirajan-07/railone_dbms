const Train = require('../models/Train');

// @desc    Fetch all trains / search trains // @route   GET /api/trains // @access  Public
const getTrains = async (req, res) => {
    try {
        const { source, destination } = req.query;
        let query = {};
        if (source && destination) {
            query = {
                source: { $regex: new RegExp(source, "i") },
                destination: { $regex: new RegExp(destination, "i") }
            };
        }
        const trains = await Train.find(query);
        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single train // @route   GET /api/trains/:id // @access  Public
const getTrainById = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (train) {
            res.json(train);
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a train // @route   POST /api/trains // @access  Private/Admin
const createTrain = async (req, res) => {
    try {
        const train = new Train(req.body);
        const createdTrain = await train.save();
        res.status(201).json(createdTrain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a train // @route   PUT /api/trains/:id // @access  Private/Admin
const updateTrain = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (train) {
            Object.assign(train, req.body);
            const updatedTrain = await train.save();
            res.json(updatedTrain);
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a train // @route   DELETE /api/trains/:id // @access  Private/Admin
const deleteTrain = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (train) {
            await train.deleteOne();
            res.json({ message: 'Train removed' });
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTrains, getTrainById, createTrain, updateTrain, deleteTrain };
