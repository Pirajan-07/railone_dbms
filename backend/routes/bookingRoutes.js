const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings, getBookingByPNR } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getAllBookings);

router.route('/pnr/:pnr')
    .get(getBookingByPNR);

router.route('/user/:id')
    .get(protect, getUserBookings);

router.route('/:id')
    .get(protect, getBookingById)
    .delete(protect, cancelBooking);

module.exports = router;
