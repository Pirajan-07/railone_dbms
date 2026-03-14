const { db } = require('../config/db');
const jwt = require('jsonwebtoken');

const generateToken = (user_id) => {
    return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        // Use promise wrapper for queries
        const query = (sql, params) => new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // 1. Check if user exists
        const users = await query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Note: For simplicity, storing plain password. Use bcrypt to hash passwords in production.
        const insertResult = await query(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, password, phone]
        );

        if (insertResult.insertId) {
            res.status(201).json({
                _id: insertResult.insertId,
                name: name,
                email: email,
                phone: phone,
                isAdmin: false, // No admin column created per user prompt, default false
                token: generateToken(insertResult.insertId),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const query = (sql, params) => new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Use direct password comparison per user's prompt (SELECT * FROM users WHERE email=? AND password=?) 
        // Note: Compare securely using bcrypt.compare in production if passwords were hashed.
        const users = await query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (users.length > 0) {
            const user = users[0];
            res.json({
                _id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: false,
                token: generateToken(user.user_id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        // req.user comes from authMiddleware
        const userId = req.user.user_id || req.user._id; 
        
        const query = (sql, params) => new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const users = await query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (users.length > 0) {
            const user = users[0];
            
            // Allow update of fields
            const newName = req.body.name || user.name;
            const newEmail = req.body.email || user.email;
            const newPhone = req.body.phone || user.phone;
            const newPassword = req.body.password || user.password; // Simple plaintext replacement

            await query(
                'UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE user_id = ?',
                [newName, newEmail, newPhone, newPassword, userId]
            );

            res.json({
                _id: userId,
                name: newName,
                email: newEmail,
                phone: newPhone,
                isAdmin: false,
                token: generateToken(userId),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile };
