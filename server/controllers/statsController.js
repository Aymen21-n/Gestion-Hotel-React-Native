const { get } = require('../db/database');

const getStats = async (req, res) => {
  try {
    const rooms = await get('SELECT COUNT(*) as count FROM rooms');
    const reservations = await get('SELECT COUNT(*) as count FROM reservations');
    const invoices = await get('SELECT SUM(montantTotal) as total FROM invoices');
    const occupied = await get("SELECT COUNT(*) as count FROM rooms WHERE estReserve = 1");
    const tauxOccupation = rooms.count === 0 ? 0 : Math.round((occupied.count / rooms.count) * 100);

    res.json({
      nombreChambres: rooms.count,
      nombreReservations: reservations.count,
      tauxOccupation,
      totalFacture: invoices.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getStats,
};
