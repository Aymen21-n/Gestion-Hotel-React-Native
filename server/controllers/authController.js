const { get } = require('../db/database');

const adminLogin = async (req, res) => {
  const { emailAdmin, motDePasse } = req.body;
  if (!emailAdmin || !motDePasse) {
    res.status(400).json({ message: 'Email et mot de passe requis.' });
    return;
  }

  try {
    const admin = await get(
      'SELECT id, emailAdmin FROM admins WHERE emailAdmin = ? AND motDePasse = ?',
      [emailAdmin, motDePasse]
    );

    if (!admin) {
      res.status(401).json({ message: 'Identifiants invalides.' });
      return;
    }

    res.json({ token: `admin-token-${admin.id}`, role: 'admin', admin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const clientLogin = async (req, res) => {
  const { cin, email } = req.body;
  if (!email && !cin) {
    res.status(400).json({ message: 'Email ou CIN requis.' });
    return;
  }

  try {
    const client = await get(
      'SELECT id, cin, nom, prenom, email FROM clients WHERE email = ? OR cin = ?',
      [email || '', cin || '']
    );

    if (!client) {
      res.status(401).json({ message: 'Client introuvable.' });
      return;
    }

    res.json({ token: `client-token-${client.id}`, role: 'client', client });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  adminLogin,
  clientLogin,
};
