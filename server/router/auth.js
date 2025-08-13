const express = require('express');
const authController = require('../controller/auth');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/get-access-token', authMiddleware, authController.getAccessToken);


module.exports = router;