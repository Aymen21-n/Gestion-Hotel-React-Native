const { all, get, run } = require('../db/database');

const dateDiffInNights = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const isRoomAvailable = async (roomId, dateDebut, dateFin, excludeReservationId) => {
  const params = [roomId, dateFin, dateDebut];
  let sql =
    "SELECT COUNT(*) as count FROM reservations WHERE room_id = ? AND statut != 'ANNULEE' AND dateDebut < ? AND dateFin > ?";

  if (excludeReservationId) {
    sql += ' AND id != ?';
    params.push(excludeReservationId);
  }

  const result = await get(sql, params);
  return result.count === 0;
};

const listReservations = async (req, res) => {
  try {
    const reservations = await all(
      `SELECT reservations.*, rooms.numero, rooms.categorie, clients.nom as clientNom, clients.prenom as clientPrenom
       FROM reservations
       JOIN rooms ON rooms.id = reservations.room_id
       JOIN clients ON clients.id = reservations.client_id`
    );
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createReservation = async (req, res) => {
  const { room_id, client_id, dateDebut, dateFin, typeReservation } = req.body;
  if (!room_id || !client_id || !dateDebut || !dateFin || !typeReservation) {
    res.status(400).json({ message: 'Champs requis manquants.' });
    return;
  }

  const nights = dateDiffInNights(dateDebut, dateFin);
  if (Number.isNaN(nights) || nights <= 0) {
    res.status(400).json({ message: 'Dates invalides.' });
    return;
  }

  try {
    const available = await isRoomAvailable(room_id, dateDebut, dateFin);
    if (!available) {
      res.status(409).json({ message: 'Chambre déjà réservée sur cette période.' });
      return;
    }

    const room = await get('SELECT prixParNuit FROM rooms WHERE id = ?', [room_id]);
    if (!room) {
      res.status(404).json({ message: 'Chambre introuvable.' });
      return;
    }

    const montant = nights * room.prixParNuit;

    const result = await run(
      `INSERT INTO reservations (room_id, client_id, dateDebut, dateFin, typeReservation, statut, montant)
       VALUES (?, ?, ?, ?, ?, 'EN_ATTENTE', ?)`,
      [room_id, client_id, dateDebut, dateFin, typeReservation, montant]
    );

    const reservation = await get('SELECT * FROM reservations WHERE id = ?', [result.lastID]);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateReservationStatus = async (req, res, statut) => {
  try {
    const reservation = await get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!reservation) {
      res.status(404).json({ message: 'Réservation introuvable.' });
      return;
    }

    if (statut === 'CONFIRMEE') {
      const available = await isRoomAvailable(
        reservation.room_id,
        reservation.dateDebut,
        reservation.dateFin,
        reservation.id
      );
      if (!available) {
        res.status(409).json({ message: 'Chambre déjà réservée sur cette période.' });
        return;
      }
    }

    await run('UPDATE reservations SET statut = ? WHERE id = ?', [statut, req.params.id]);
    const updated = await get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);

    if (statut === 'CONFIRMEE') {
      await run('UPDATE rooms SET estReserve = 1 WHERE id = ?', [updated.room_id]);
    }

    if (statut === 'ANNULEE') {
      const active = await get(
        "SELECT COUNT(*) as count FROM reservations WHERE room_id = ? AND statut = 'CONFIRMEE'",
        [updated.room_id]
      );
      if (active.count === 0) {
        await run('UPDATE rooms SET estReserve = 0 WHERE id = ?', [updated.room_id]);
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const confirmReservation = (req, res) => updateReservationStatus(req, res, 'CONFIRMEE');
const cancelReservation = (req, res) => updateReservationStatus(req, res, 'ANNULEE');

module.exports = {
  listReservations,
  createReservation,
  confirmReservation,
  cancelReservation,
};
