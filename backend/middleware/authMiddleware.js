const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const users = await query('SELECT user_id, name, email, phone FROM users WHERE user_id = ?', [decoded.id]);
            
            if (users.length > 0) {
                req.user = users[0];
                // Map user_id to _id for backward compatibility
                req.user._id = req.user.user_id; 
                // We're mimicking an admin check via hardcoded email because there's no isAdmin column
                // per the user's table schema prompt. Adjust if an isAdmin col gets added later.
                req.user.isAdmin = req.user.email === 'admin@example.com';
                next();
            } else {
                 res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
