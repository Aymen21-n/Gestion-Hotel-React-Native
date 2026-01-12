const express = require('express');
const { getInvoiceByReservation, generateInvoice, listInvoices } = require('../controllers/invoicesController');

const router = express.Router();

router.get('/', listInvoices);
router.get('/:reservationId', getInvoiceByReservation);
router.post('/generate', generateInvoice);

module.exports = router;
