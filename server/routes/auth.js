const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

// Login (tanpa token)
router.post('/login', authController.login);

// Update data admin (dilindungi token + pakai method PUT)
router.put('/update', verifyToken, authController.updateAdmin);

// Logout admin (dilindungi token, meskipun opsional di backend)
router.post('/logout', verifyToken, authController.logoutAdmin);

module.exports = router;
