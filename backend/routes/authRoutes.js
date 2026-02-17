const express = require('express');
const router = express.Router();
const { login, getCurrentUser } = require('../controllers/authController');

router.post('/login', login);
router.get('/me', getCurrentUser);

module.exports = router;
