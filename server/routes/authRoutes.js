const express = require('express');
const { adminLogin, clientLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/client/login', clientLogin);

module.exports = router;
