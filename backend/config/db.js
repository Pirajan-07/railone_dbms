const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'railway_system'
});

const connectDB = () => {
    db.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err.message);
            process.exit(1);
        } else {
            console.log('Connected to MySQL database: railway_system');
        }
    });
};

// Export both the connection instance to be used by controllers,
// and the connect config function for server.js initialization
module.exports = { db, connectDB };
