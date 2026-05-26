const express = require('express');
const router = express.Router();


router.get('/message', (req, res) => {
    res.json({ message: 'This route is public' });
});

module.exports = router;