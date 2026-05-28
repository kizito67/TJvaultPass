const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middlewares/user.middlewares')
const { signUp, signIn, verifyEmail, resendOtp } = require('../controllers/user.controllers');




router.post('/signup', signUp);
router.post('/signin', signIn);
router.patch('/verify-email', verifyEmail);
router.patch('/resend-otp', resendOtp);




router.get("/profile", authenticateToken, (req, res) => {
    res.json({ user: req.user });
});




module.exports = router;