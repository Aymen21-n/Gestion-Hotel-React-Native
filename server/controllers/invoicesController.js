const { all, get, run } = require('../db/database');

const getInvoiceByReservation = async (req, res) => {
  try {
    const invoice = await get(
      `SELECT invoices.*, reservations.montant, reservations.statut
       FROM invoices
       JOIN reservations ON reservations.id = invoices.reservation_id
       WHERE invoices.reservation_id = ?`,
      [req.params.reservationId]
    );
    if (!invoice) {
      res.status(404).json({ message: 'Facture introuvable.' });
      return;
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const generateInvoice = async (req, res) => {
  const { reservation_id, modePaiement } = req.body;
  if (!reservation_id || !modePaiement) {
    res.status(400).json({ message: 'Champs requis manquants.' });
    return;
  }

  try {
    const reservation = await get('SELECT * FROM reservations WHERE id = ?', [reservation_id]);
    if (!reservation) {
      res.status(404).json({ message: 'Réservation introuvable.' });
      return;
    }

    const existing = await get('SELECT * FROM invoices WHERE reservation_id = ?', [reservation_id]);
    if (existing) {
      res.json(existing);
      return;
    }

    const result = await run(
      `INSERT INTO invoices (reservation_id, dateFacture, montantTotal, modePaiement)
       VALUES (?, ?, ?, ?)`,
      [reservation_id, new Date().toISOString(), reservation.montant, modePaiement]
    );
    const invoice = await get('SELECT * FROM invoices WHERE id = ?', [result.lastID]);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const listInvoices = async (req, res) => {
  try {
    const invoices = await all('SELECT * FROM invoices');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getInvoiceByReservation,
  generateInvoice,
  listInvoices,
};
