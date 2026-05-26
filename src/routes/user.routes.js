const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middlewares/user.middlewares')
const { signUp, signIn } = require('../controllers/user.controllers');




router.post('/signup', signUp);
router.post('/signin', signIn);




router.get("/profile", authenticateToken, (req, res) => {
    res.json({ user: req.user });
});




module.exports = router;