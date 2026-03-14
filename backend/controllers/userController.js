const { db } = require('../config/db');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        db.query('SELECT user_id, name, email, phone FROM users', (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers };
