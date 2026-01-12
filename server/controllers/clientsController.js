const { all, get, run } = require('../db/database');

const listClients = async (req, res) => {
  try {
    const clients = await all('SELECT id, cin, nom, prenom, telephone, email FROM clients');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createClient = async (req, res) => {
  const { cin, nom, prenom, telephone, email } = req.body;
  if (!cin || !nom || !prenom || !email) {
    res.status(400).json({ message: 'Champs requis manquants.' });
    return;
  }

  try {
    const existing = await get('SELECT id FROM clients WHERE email = ? OR cin = ?', [email, cin]);
    if (existing) {
      res.status(409).json({ message: 'Client déjà existant.' });
      return;
    }

    const result = await run(
      'INSERT INTO clients (cin, nom, prenom, telephone, email) VALUES (?, ?, ?, ?, ?)',
      [cin, nom, prenom, telephone || null, email]
    );
    const client = await get('SELECT id, cin, nom, prenom, telephone, email FROM clients WHERE id = ?', [
      result.lastID,
    ]);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  listClients,
  createClient,
};
