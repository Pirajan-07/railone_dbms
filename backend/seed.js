const { db } = require('./config/db');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Custom query wrapper since we are seeding
const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const importData = async () => {
    try {
        console.log('Connecting to DB and clearing existing data...');
        // Clear existing data (Order matters due to foreign keys)
        await query('DELETE FROM train_classes');
        await query('DELETE FROM train_routes');
        await query('DELETE FROM bookings');
        await query('DELETE FROM trains');
        await query('DELETE FROM users');

        // Reset auto_increments
        await query('ALTER TABLE train_classes AUTO_INCREMENT = 1');
        await query('ALTER TABLE train_routes AUTO_INCREMENT = 1');
        await query('ALTER TABLE bookings AUTO_INCREMENT = 1');
        await query('ALTER TABLE trains AUTO_INCREMENT = 1');
        await query('ALTER TABLE users AUTO_INCREMENT = 1');

        console.log('Inserting Admin & User...');
        const salt = await bcrypt.genSalt(10);
        // Note: For this project we're using plaintext for simplicity as seen in authController per prompt constraints
        // We will just insert simple passwords to let login work easily (which expects plaintext as per prompt)
        const password = 'admin123'; 

        // Insert Admin
        await query(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            ['Admin User', 'admin@example.com', password, '1234567890']
        );

        // Insert Regular User
        await query(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            ['Regular User', 'user@example.com', password, '0987654321']
        );

        console.log('Inserting Trains...');
        const trains = [
            { trainName: 'Shatabdi Express', trainNumber: 12002, trainType: 'SHATABDI', source: 'Delhi', destination: 'Bhopal', departureTime: '06:00 AM', arrivalTime: '02:05 PM', classes: [{type: 'CC', capacity: 150, price: 1200}, {type: '2S', capacity: 200, price: 600}], routes: ['New Delhi', 'Mathura Jn', 'Agra Cantt', 'Gwalior', 'Jhansi Jn', 'Bhopal Jn'] },
            { trainName: 'Vande Bharat Express', trainNumber: 22436, trainType: 'SHATABDI', source: 'Delhi', destination: 'Varanasi', departureTime: '06:00 AM', arrivalTime: '02:00 PM', classes: [{type: 'CC', capacity: 100, price: 1500}, {type: '2S', capacity: 150, price: 900}], routes: ['New Delhi', 'Kanpur Central', 'Prayagraj Jn', 'Varanasi Jn', 'Pt. Deen Dayal Upadhyaya Jn'] },
            { trainName: 'Rajdhani Express', trainNumber: 12952, trainType: 'EXPRESS', source: 'Delhi', destination: 'Mumbai', departureTime: '04:25 PM', arrivalTime: '08:15 AM', classes: [{type: '1A', capacity: 20, price: 3500}, {type: '2A', capacity: 80, price: 2800}, {type: '3A', capacity: 200, price: 2100}, {type: 'SL', capacity: 150, price: 1200}], routes: ['New Delhi', 'Kota Jn', 'Ratlam Jn', 'Vadodara Jn', 'Surat', 'Mumbai Central'] },
            { trainName: 'Duronto Express', trainNumber: 12220, trainType: 'EXPRESS', source: 'Mumbai', destination: 'Secunderabad', departureTime: '11:05 PM', arrivalTime: '01:10 PM', classes: [{type: '1A', capacity: 10, price: 2800}, {type: '2A', capacity: 60, price: 2100}, {type: '3A', capacity: 180, price: 1500}, {type: 'SL', capacity: 200, price: 900}], routes: ['Lokmanya Tilak Terminus', 'Pune Jn', 'Solapur', 'Wadi Jn', 'Secunderabad Jn'] },
            { trainName: 'Chennai Express', trainNumber: 12622, trainType: 'EXPRESS', source: 'New Delhi', destination: 'Chennai', departureTime: '10:30 PM', arrivalTime: '06:15 AM', classes: [{type: '1A', capacity: 12, price: 4200}, {type: '2A', capacity: 60, price: 3100}, {type: '3A', capacity: 150, price: 2300}, {type: 'SL', capacity: 300, price: 1100}], routes: ['New Delhi', 'Agra Cantt', 'Gwalior', 'Jhansi Jn', 'Bhopal Jn', 'Nagpur', 'Balharshah', 'Warangal', 'Vijayawada Jn', 'Chennai Central'] },
            { trainName: 'Karnataka Express', trainNumber: 12628, trainType: 'EXPRESS', source: 'New Delhi', destination: 'Bengaluru', departureTime: '08:15 PM', arrivalTime: '01:00 PM', classes: [{type: '1A', capacity: 15, price: 3900}, {type: '2A', capacity: 55, price: 2900}, {type: '3A', capacity: 130, price: 2200}, {type: 'SL', capacity: 350, price: 1050}], routes: ['New Delhi', 'Mathura Jn', 'Agra Cantt', 'Gwalior', 'Jhansi Jn', 'Bhopal Jn', 'Itarsi Jn', 'Khandwa', 'Kalaburagi', 'KSR Bengaluru'] },
            { trainName: 'Tamil Nadu Express', trainNumber: 12621, trainType: 'EXPRESS', source: 'Chennai', destination: 'New Delhi', departureTime: '10:00 PM', arrivalTime: '06:30 AM', classes: [{type: '1A', capacity: 12, price: 4200}, {type: '2A', capacity: 60, price: 3100}, {type: '3A', capacity: 150, price: 2300}, {type: 'SL', capacity: 300, price: 1100}], routes: ['Chennai Central', 'Vijayawada Jn', 'Warangal', 'Balharshah', 'Nagpur', 'Itarsi Jn', 'Bhopal Jn', 'Jhansi Jn', 'Gwalior', 'Agra Cantt', 'New Delhi'] },
            { trainName: 'Intercity Express', trainNumber: 12128, trainType: 'SHATABDI', source: 'Pune', destination: 'Mumbai', departureTime: '05:55 PM', arrivalTime: '09:05 PM', classes: [{type: 'CC', capacity: 60, price: 400}, {type: '2S', capacity: 140, price: 250}], routes: ['Pune Jn', 'Lonavala', 'Khandala', 'Karjat', 'Kalyan Jn', 'Dadar', 'Mumbai CSMT'] },
            { trainName: 'Garib Rath Express', trainNumber: 12910, trainType: 'EXPRESS', source: 'Delhi', destination: 'Mumbai', departureTime: '03:30 PM', arrivalTime: '08:10 AM', classes: [{type: '1A', capacity: 5, price: 2000}, {type: '2A', capacity: 15, price: 1500}, {type: '3A', capacity: 300, price: 850}, {type: 'SL', capacity: 100, price: 400}], routes: ['Hazrat Nizamuddin', 'Mathura Jn', 'Kota Jn', 'Ratlam Jn', 'Vadodara Jn', 'Surat', 'Bandra Terminus'] },
            { trainName: 'Gatimaan Express', trainNumber: 12050, trainType: 'SHATABDI', source: 'Delhi', destination: 'Jhansi', departureTime: '08:10 AM', arrivalTime: '12:35 PM', classes: [{type: 'CC', capacity: 200, price: 1100}, {type: '2S', capacity: 50, price: 600}], routes: ['Hazrat Nizamuddin', 'Agra Cantt', 'Gwalior', 'VGL Jhansi'] },
        ];

        for (const train of trains) {
            const res = await query(
                `INSERT INTO trains 
                (train_name, train_number, train_type, source, destination, departure_time, arrival_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    train.trainName, train.trainNumber, train.trainType, train.source, train.destination, 
                    train.departureTime, train.arrivalTime
                ]
            );

            const trainId = res.insertId;

            // Seed classes for this train
            for (const cls of train.classes) {
                await query(
                    `INSERT INTO train_classes (train_id, class_type, total_seats, available_seats, price) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [trainId, cls.type, cls.capacity, cls.capacity, cls.price]
                );
            }

            // Seed specific routes
            const stops = train.routes;
            for (let i = 0; i < stops.length; i++) {
                await query('INSERT INTO train_routes (train_id, station_name, stop_number) VALUES (?, ?, ?)', [trainId, stops[i], i + 1]);
            }
        }

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error importing data: ${error.message}`);
        process.exit(1);
    }
};

// Delay import to allow db connection to establish
setTimeout(importData, 1000);
