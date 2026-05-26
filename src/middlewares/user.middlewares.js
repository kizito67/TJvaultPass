const jwt = require('jsonwebtoken');
const { User } = require('../models/user.models');

const authenticateToken = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Session expired. Please login again.'
            });
        }

        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

const errorHandler = (err, req, res, next) => {
    res.status(res.statusCode || 500).json({ message: err.message });
};

module.exports = { authenticateToken, authorizeRoles, errorHandler };