const mysql = require('mysql2');

const ports = [3306, 3307, 3308, 3309, 8889];

async function checkPort(port) {
    return new Promise((resolve) => {
        const db = mysql.createConnection({
            host: 'localhost',
            port: port,
            user: 'root',
            password: ''
        });
        
        db.connect(err => {
            if (err) {
                resolve({ port, status: 'Failed' });
                return;
            }
            db.query('SHOW DATABASES', (err, results) => {
                if (!err) {
                    const dbs = results.map(r => r.Database);
                    if (dbs.includes('railway_system')) {
                        console.log(`FOUND railway_system ON PORT: ${port}`);
                    }
                }
                resolve({ port, status: 'Done' });
                db.end();
            });
        });
    });
}

async function run() {
    for (const port of ports) {
        console.log(`Checking port ${port}...`);
        const result = await checkPort(port);
        console.log(result);
    }
    process.exit(0);
}

run();
