const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Train = require('./models/Train');
const Booking = require('./models/Booking');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
    try {
        await User.deleteMany();
        await Train.deleteMany();
        await Booking.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);

        await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: adminPassword,
                phone: '1234567890',
                isAdmin: true
            },
            {
                name: 'Regular User',
                email: 'user@example.com',
                password: adminPassword,
                phone: '0987654321',
            }
        ]);

        const trains = [
            { trainName: 'Vande Bharat Express', trainNumber: '22436', source: 'Delhi', destination: 'Varanasi', totalSeats: 120, availableSeats: 120, departureTime: '06:00 AM', arrivalTime: '02:00 PM', price: 1500 },
            { trainName: 'Rajdhani Express', trainNumber: '12952', source: 'Delhi', destination: 'Mumbai', totalSeats: 300, availableSeats: 300, departureTime: '04:25 PM', arrivalTime: '08:15 AM', price: 2800 },
            { trainName: 'Shatabdi Express', trainNumber: '12002', source: 'Delhi', destination: 'Bhopal', totalSeats: 150, availableSeats: 150, departureTime: '06:00 AM', arrivalTime: '02:05 PM', price: 1200 },
            { trainName: 'Duronto Express', trainNumber: '12220', source: 'Mumbai', destination: 'Hyderabad', totalSeats: 250, availableSeats: 250, departureTime: '11:05 PM', arrivalTime: '01:10 PM', price: 2100 },
            { trainName: 'Garib Rath', trainNumber: '12910', source: 'Delhi', destination: 'Mumbai', totalSeats: 400, availableSeats: 400, departureTime: '03:30 PM', arrivalTime: '08:10 AM', price: 850 },
            { trainName: 'Tejas Express', trainNumber: '22119', source: 'Mumbai', destination: 'Pune', totalSeats: 100, availableSeats: 100, departureTime: '05:50 AM', arrivalTime: '09:00 AM', price: 900 },
            { trainName: 'Humsafar Express', trainNumber: '22317', source: 'Kolkata', destination: 'Chennai', totalSeats: 320, availableSeats: 320, departureTime: '02:00 PM', arrivalTime: '04:15 PM', price: 1800 },
            { trainName: 'Double Decker', trainNumber: '12932', source: 'Ahmedabad', destination: 'Mumbai', totalSeats: 450, availableSeats: 450, departureTime: '06:00 AM', arrivalTime: '01:00 PM', price: 700 },
            { trainName: 'Intercity Express', trainNumber: '12128', source: 'Pune', destination: 'Mumbai', totalSeats: 200, availableSeats: 200, departureTime: '05:55 PM', arrivalTime: '09:05 PM', price: 400 },
            { trainName: 'Jan Shatabdi', trainNumber: '12059', source: 'Delhi', destination: 'Chandigarh', totalSeats: 180, availableSeats: 180, departureTime: '02:30 PM', arrivalTime: '07:00 PM', price: 650 },
            { trainName: 'Mysore Express', trainNumber: '16231', source: 'Bangalore', destination: 'Mysore', totalSeats: 250, availableSeats: 250, departureTime: '06:00 AM', arrivalTime: '09:00 AM', price: 300 },
            { trainName: 'Coromandel Exp', trainNumber: '12841', source: 'Chennai', destination: 'Kolkata', totalSeats: 350, availableSeats: 350, departureTime: '07:00 AM', arrivalTime: '10:40 AM', price: 1900 },
            { trainName: 'Konark Express', trainNumber: '11020', source: 'Hyderabad', destination: 'Mumbai', totalSeats: 300, availableSeats: 300, departureTime: '11:40 AM', arrivalTime: '04:00 AM', price: 1600 },
            { trainName: 'Gujarat Mail', trainNumber: '12901', source: 'Mumbai', destination: 'Ahmedabad', totalSeats: 280, availableSeats: 280, departureTime: '09:40 PM', arrivalTime: '05:50 AM', price: 1100 },
            { trainName: 'Ganga Kaveri', trainNumber: '12669', source: 'Chennai', destination: 'Varanasi', totalSeats: 320, availableSeats: 320, departureTime: '05:40 PM', arrivalTime: '07:10 AM', price: 2300 }
        ];

        await Train.insertMany(trains);

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
