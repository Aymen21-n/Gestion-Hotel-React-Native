const { all, get, run } = require('../db/database');

const listEmployees = async (req, res) => {
  try {
    const employees = await all('SELECT * FROM employees');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur: ${error.message}` });
  }
};

const createEmployee = async (req, res) => {
  const { hotel_id, idEmploye, nom, prenom, poste, salaire, horaire } = req.body;
  if (!hotel_id || !idEmploye || !nom || !prenom || !poste || salaire === undefined || !horaire) {
    res.status(400).json({ message: 'Champs requis manquants.' });
    return;
  }

  const salaireNumber = Number(salaire);
  if (Number.isNaN(salaireNumber)) {
    res.status(400).json({ message: 'Salaire invalide.' });
    return;
  }

  try {
    const result = await run(
      `INSERT INTO employees (hotel_id, idEmploye, nom, prenom, poste, salaire, horaire)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [hotel_id, idEmploye, nom, prenom, poste, salaireNumber, horaire]
    );
    const employee = await get('SELECT * FROM employees WHERE id = ?', [result.lastID]);
    res.status(201).json(employee);
  } catch (error) {
    if (error && error.message && error.message.includes('UNIQUE')) {
      res.status(409).json({ message: 'ID Employé déjà utilisé.' });
      return;
    }
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateEmployee = async (req, res) => {
  const { nom, prenom, poste, salaire, horaire } = req.body;
  try {
    await run(
      `UPDATE employees SET nom = ?, prenom = ?, poste = ?, salaire = ?, horaire = ?
       WHERE id = ?`,
      [nom, prenom, poste, salaire, horaire, req.params.id]
    );
    const employee = await get('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await run('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employé supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  listEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
