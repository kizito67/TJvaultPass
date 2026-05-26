const express = require('express');
const router = express.Router();
const {authenticateToken, authorizeRoles} = require('../middlewares/user.middlewares')





router.get("/reports", authenticateToken, authorizeRoles("moderator","admin"), (req, res) => {
    res.json({ message: 'Moderator reports' });
});

module.exports = router;