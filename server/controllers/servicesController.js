const { all, get, run } = require('../db/database');

const listServices = async (req, res) => {
  try {
    const services = await all('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createService = async (req, res) => {
  const {
    hotel_id,
    type,
    nomService,
    horaireOuverture,
    horaireFermeture,
    nbSallesMassage,
    typeSoins,
    typeCuisine,
    capacite,
    menu,
    profondeur,
    estChauffee,
    superficie,
    nbAppareils,
    entraineurDisponible,
    horairesCours,
    nomDJ,
    styleMusical,
    ageMinimum,
  } = req.body;

  if (!hotel_id || !type || !nomService || !horaireOuverture || !horaireFermeture) {
    res.status(400).json({ message: 'Champs requis manquants.' });
    return;
  }

  try {
    const result = await run(
      `INSERT INTO services (
        hotel_id, type, nomService, horaireOuverture, horaireFermeture,
        nbSallesMassage, typeSoins, typeCuisine, capacite, menu,
        profondeur, estChauffee, superficie, nbAppareils, entraineurDisponible,
        horairesCours, nomDJ, styleMusical, ageMinimum
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hotel_id,
        type,
        nomService,
        horaireOuverture,
        horaireFermeture,
        nbSallesMassage || null,
        typeSoins || null,
        typeCuisine || null,
        capacite || null,
        menu || null,
        profondeur || null,
        estChauffee ? 1 : 0,
        superficie || null,
        nbAppareils || null,
        entraineurDisponible ? 1 : 0,
        horairesCours || null,
        nomDJ || null,
        styleMusical || null,
        ageMinimum || null,
      ]
    );
    const service = await get('SELECT * FROM services WHERE id = ?', [result.lastID]);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateService = async (req, res) => {
  const {
    type,
    nomService,
    horaireOuverture,
    horaireFermeture,
    nbSallesMassage,
    typeSoins,
    typeCuisine,
    capacite,
    menu,
    profondeur,
    estChauffee,
    superficie,
    nbAppareils,
    entraineurDisponible,
    horairesCours,
    nomDJ,
    styleMusical,
    ageMinimum,
  } = req.body;

  try {
    await run(
      `UPDATE services SET
        type = ?,
        nomService = ?,
        horaireOuverture = ?,
        horaireFermeture = ?,
        nbSallesMassage = ?,
        typeSoins = ?,
        typeCuisine = ?,
        capacite = ?,
        menu = ?,
        profondeur = ?,
        estChauffee = ?,
        superficie = ?,
        nbAppareils = ?,
        entraineurDisponible = ?,
        horairesCours = ?,
        nomDJ = ?,
        styleMusical = ?,
        ageMinimum = ?
       WHERE id = ?`,
      [
        type,
        nomService,
        horaireOuverture,
        horaireFermeture,
        nbSallesMassage || null,
        typeSoins || null,
        typeCuisine || null,
        capacite || null,
        menu || null,
        profondeur || null,
        estChauffee ? 1 : 0,
        superficie || null,
        nbAppareils || null,
        entraineurDisponible ? 1 : 0,
        horairesCours || null,
        nomDJ || null,
        styleMusical || null,
        ageMinimum || null,
        req.params.id,
      ]
    );
    const service = await get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteService = async (req, res) => {
  try {
    await run('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  listServices,
  createService,
  updateService,
  deleteService,
};
