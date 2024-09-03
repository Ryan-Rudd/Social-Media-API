const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token, authorization denied',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id).select('-password -sessionToken');
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found, authorization denied',
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is not valid',
            error: error.message,
        });
    }
};
