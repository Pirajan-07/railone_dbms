const fs = require('fs');
const mysql = require('mysql2/promise');

async function initDB() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true
        });

        const sql = fs.readFileSync('database.sql', 'utf8');
        
        console.log("Executing database.sql...");
        await connection.query(sql);
        console.log("Database and tables created successfully!");
        
        await connection.end();
    } catch (error) {
        console.error("Error setting up DB:", error);
    }
}

initDB();
