const express = require('express');
const { listRooms, getRoom, createRoom, updateRoom, deleteRoom } = require('../controllers/roomsController');

const router = express.Router();

router.get('/', listRooms);
router.get('/:id', getRoom);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
