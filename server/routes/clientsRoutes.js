const express = require('express');
const { listClients, createClient } = require('../controllers/clientsController');

const router = express.Router();

router.get('/', listClients);
router.post('/', createClient);

module.exports = router;
