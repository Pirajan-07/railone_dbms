const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    pnr: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    trainId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Train'
    },
    travelDate: {
        type: String, // "YYYY-MM-DD"
        required: true
    },
    numberOfTickets: {
        type: Number,
        required: true,
        default: 1
    },
    seatNumbers: {
        type: [Number],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Booked', 'Cancelled'],
        default: 'Booked'
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
