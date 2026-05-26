const express = require('express');
const router = express.Router();
const {authenticateToken, authorizeRoles} = require('../middlewares/user.middlewares')
const { deleteUser, promoteUser, signIn } = require('../controllers/user.controllers');



router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), deleteUser);
router.post('/users/:id/promote', authenticateToken, authorizeRoles('admin'), promoteUser);

router.post('/signin', signIn);

module.exports = router;