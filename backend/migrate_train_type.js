const { db } = require('./config/db');

const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const applyMigrations = async () => {
    try {
        console.log('Adding train_type column to trains table...');
        try {
            await query('ALTER TABLE trains ADD COLUMN train_type VARCHAR(20)');
            console.log('Column added successfully.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column train_type already exists. Skipping.');
            } else {
                throw e;
            }
        }
        
        console.log('Migration successful!');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

setTimeout(applyMigrations, 1000);
