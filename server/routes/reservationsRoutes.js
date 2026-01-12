const express = require('express');
const {
  listReservations,
  createReservation,
  confirmReservation,
  cancelReservation,
} = require('../controllers/reservationsController');

const router = express.Router();

router.get('/', listReservations);
router.post('/', createReservation);
router.post('/:id/confirm', confirmReservation);
router.post('/:id/cancel', cancelReservation);

module.exports = router;
