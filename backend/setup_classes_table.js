const { db } = require('./config/db');

const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const applyMigrations = async () => {
    try {
        console.log('Creating train_classes table...');
        await query(`
            CREATE TABLE IF NOT EXISTS train_classes (
                class_id INT AUTO_INCREMENT PRIMARY KEY,
                train_id INT,
                class_type VARCHAR(50),
                total_seats INT,
                available_seats INT,
                price DECIMAL(10, 2),
                FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE
            )
        `);

        console.log('Cleaning up trains table...');
        // Ignore errors if columns already dropped
        try { await query('ALTER TABLE trains DROP COLUMN total_seats'); } catch(e){}
        try { await query('ALTER TABLE trains DROP COLUMN available_seats'); } catch(e){}
        try { await query('ALTER TABLE trains DROP COLUMN price'); } catch(e){}
        try { await query('ALTER TABLE trains DROP COLUMN seat_type'); } catch(e){}

        console.log('Updating bookings table...');
        try { await query('ALTER TABLE bookings ADD COLUMN class_id INT'); } catch(e){}
        try { await query('ALTER TABLE bookings DROP COLUMN seat_type'); } catch(e){}
        
        console.log('Migration successful!');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

setTimeout(applyMigrations, 1000);
