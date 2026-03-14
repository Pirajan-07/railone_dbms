const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getAllBookings);

router.route('/user/:id')
    .get(protect, getUserBookings);

router.route('/:id')
    .get(protect, getBookingById)
    .delete(protect, cancelBooking);

module.exports = router;
