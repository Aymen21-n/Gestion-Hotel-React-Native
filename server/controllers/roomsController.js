const { all, get, run } = require('../db/database');

const listRooms = async (req, res) => {
  try {
    const rooms = await all('SELECT * FROM rooms');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await get('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (!room) {
      res.status(404).json({ message: 'Chambre introuvable.' });
      return;
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createRoom = async (req, res) => {
  const { hotel_id, numero, categorie, etage, prixParNuit } = req.body;
  if (!hotel_id || !numero || !categorie || etage === undefined || prixParNuit === undefined) {
    res.status(400).json({ message: 'Champs requis manquants.' });
    return;
  }

  try {
    const result = await run(
      `INSERT INTO rooms (hotel_id, numero, categorie, etage, estReserve, prixParNuit)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [hotel_id, numero, categorie, etage, prixParNuit]
    );
    const room = await get('SELECT * FROM rooms WHERE id = ?', [result.lastID]);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateRoom = async (req, res) => {
  const { numero, categorie, etage, estReserve, prixParNuit } = req.body;
  try {
    await run(
      `UPDATE rooms SET numero = ?, categorie = ?, etage = ?, estReserve = ?, prixParNuit = ?
       WHERE id = ?`,
      [numero, categorie, etage, estReserve ? 1 : 0, prixParNuit, req.params.id]
    );
    const room = await get('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await run('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Chambre supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
