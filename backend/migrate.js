const fs = require('fs');
const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'railway_system',
            multipleStatements: true
        });

        console.log("Adding seat_type to trains...");
        try {
            await connection.query('ALTER TABLE trains ADD COLUMN seat_type VARCHAR(50) DEFAULT "General"');
            console.log("Added seat_type to trains.");
        } catch (e) {
            console.log("Column seat_type might already exist in trains:", e.message);
        }

        console.log("Adding seat_type to bookings...");
        try {
            await connection.query('ALTER TABLE bookings ADD COLUMN seat_type VARCHAR(50)');
            console.log("Added seat_type to bookings.");
        } catch (e) {
            console.log("Column seat_type might already exist in bookings:", e.message);
        }

        console.log("Creating passengers table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS passengers (
              passenger_id INT AUTO_INCREMENT PRIMARY KEY,
              booking_id INT,
              name VARCHAR(100),
              age INT,
              gender VARCHAR(10),
              FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
            );
        `);

        console.log("Creating train_routes table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS train_routes (
              route_id INT AUTO_INCREMENT PRIMARY KEY,
              train_id INT,
              station_name VARCHAR(100),
              stop_number INT,
              FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE
            );
        `);

        console.log("Migration executed successfully!");
        await connection.end();
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrate();
