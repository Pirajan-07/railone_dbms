const express = require('express');
const router = express.Router();
const { getTrains, getTrainById, createTrain, updateTrain, deleteTrain } = require('../controllers/trainController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTrains)
    .post(protect, admin, createTrain);

router.route('/:id')
    .get(getTrainById)
    .put(protect, admin, updateTrain)
    .delete(protect, admin, deleteTrain);

module.exports = router;
