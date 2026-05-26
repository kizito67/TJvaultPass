const { User, ActivityLog } = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generatetoken');


const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, password: hashedPassword });
        const userResponse = {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
        };
        await ActivityLog.create({ action: 'User Registered', user: newUser._id });
        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(403).json({ message: 'Account is locked. Try again later.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
                user.loginAttempts = 0; // Reset login attempts after locking
            }
            await user.save();
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        user.loginAttempts = 0; // Reset login attempts on successful login
        user.lockUntil = undefined;
        await user.save();


        const token = generateToken(user._id, user.role);
        res.json({

            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token
            }
        });

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        await ActivityLog.create({ action: 'User Signed In', user: user._id });


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({ message: 'Admins cannot delete themselves' });
    }
    await userToDelete.deleteOne();
    await ActivityLog.create({ action: 'User Deleted', user: req.user._id });
    res.json({ message: 'User deleted successfully' });
};

const promoteUser = async (req, res) => {
    console.log('promote controller hit');
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
        return res.status(400).json({ message: 'User is already an admin' });
    }
    user.role = 'moderator';
    await user.save();
    await ActivityLog.create({ action: 'User Promoted', user: req.user._id });
    res.json({ message: 'User promoted successfully' });
};



module.exports = {
    signUp,
    signIn,
    deleteUser,
    promoteUser
};