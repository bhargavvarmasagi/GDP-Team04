const express = require('express');
const authController = require('../Controllers/authControllers.js');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-reset-password', authController.requestResetPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;