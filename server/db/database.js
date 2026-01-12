const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'hotel.db');
const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function handleRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

const init = async () => {
  await run('PRAGMA foreign_keys = ON');

  await run(`CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    adresse TEXT NOT NULL,
    note REAL DEFAULT 0,
    telephone TEXT,
    nbChambres INTEGER DEFAULT 0
  )`);

  await run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emailAdmin TEXT UNIQUE NOT NULL,
    motDePasse TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    numero TEXT NOT NULL,
    categorie TEXT NOT NULL,
    etage INTEGER NOT NULL,
    estReserve INTEGER DEFAULT 0,
    prixParNuit REAL NOT NULL,
    FOREIGN KEY(hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
  )`);

  await run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    idEmploye TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    poste TEXT NOT NULL,
    salaire REAL NOT NULL,
    horaire TEXT NOT NULL,
    FOREIGN KEY(hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
  )`);

  await run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    nomService TEXT NOT NULL,
    horaireOuverture TEXT NOT NULL,
    horaireFermeture TEXT NOT NULL,
    nbSallesMassage INTEGER,
    typeSoins TEXT,
    typeCuisine TEXT,
    capacite INTEGER,
    menu TEXT,
    profondeur REAL,
    estChauffee INTEGER,
    superficie REAL,
    nbAppareils INTEGER,
    entraineurDisponible INTEGER,
    horairesCours TEXT,
    nomDJ TEXT,
    styleMusical TEXT,
    ageMinimum INTEGER,
    FOREIGN KEY(hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
  )`);

  await run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cin TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT,
    email TEXT UNIQUE NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    dateDebut TEXT NOT NULL,
    dateFin TEXT NOT NULL,
    typeReservation TEXT NOT NULL,
    statut TEXT NOT NULL,
    montant REAL NOT NULL,
    FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
  )`);

  await run(`CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER UNIQUE NOT NULL,
    dateFacture TEXT NOT NULL,
    montantTotal REAL NOT NULL,
    modePaiement TEXT NOT NULL,
    FOREIGN KEY(reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
  )`);

  const hotelCount = await get('SELECT COUNT(*) as count FROM hotels');
  if (hotelCount.count === 0) {
    await run(
      'INSERT INTO hotels (nom, adresse, note, telephone, nbChambres) VALUES (?, ?, ?, ?, ?)',
      ['Hotel Atlas', '123 Avenue des Palmiers', 4.5, '+212600000000', 6]
    );
  }

  const adminCount = await get('SELECT COUNT(*) as count FROM admins');
  if (adminCount.count === 0) {
    await run('INSERT INTO admins (emailAdmin, motDePasse) VALUES (?, ?)', [
      'admin@hotel.com',
      'admin123',
    ]);
  }

  const clientCount = await get('SELECT COUNT(*) as count FROM clients');
  if (clientCount.count === 0) {
    await run(
      'INSERT INTO clients (cin, nom, prenom, telephone, email) VALUES (?, ?, ?, ?, ?)',
      ['AB12345', 'Benali', 'Sara', '+212611111111', 'sara@client.com']
    );
  }

  const roomCount = await get('SELECT COUNT(*) as count FROM rooms');
  if (roomCount.count === 0) {
    await run(
      `INSERT INTO rooms (hotel_id, numero, categorie, etage, estReserve, prixParNuit)
       VALUES
       (1, '101', 'Standard', 1, 0, 80),
       (1, '102', 'Deluxe', 1, 0, 120),
       (1, '201', 'Suite', 2, 0, 200),
       (1, '202', 'Standard', 2, 0, 90),
       (1, '301', 'Deluxe', 3, 0, 150),
       (1, '302', 'Suite', 3, 0, 220)`
    );
  }

  const serviceCount = await get('SELECT COUNT(*) as count FROM services');
  if (serviceCount.count === 0) {
    await run(
      `INSERT INTO services (hotel_id, type, nomService, horaireOuverture, horaireFermeture, nbSallesMassage, typeSoins)
       VALUES (1, 'Spa', 'Spa Zen', '09:00', '20:00', 5, 'Relaxant')`
    );
    await run(
      `INSERT INTO services (hotel_id, type, nomService, horaireOuverture, horaireFermeture, typeCuisine, capacite, menu)
       VALUES (1, 'Restauration', 'Restaurant Atlas', '12:00', '23:00', 'Marocaine', 80, 'Tagine, Couscous')`
    );
    await run(
      `INSERT INTO services (hotel_id, type, nomService, horaireOuverture, horaireFermeture, profondeur, estChauffee, superficie)
       VALUES (1, 'Piscine', 'Piscine Centrale', '08:00', '22:00', 1.6, 1, 120)`
    );
  }

  const employeeCount = await get('SELECT COUNT(*) as count FROM employees');
  if (employeeCount.count === 0) {
    await run(
      `INSERT INTO employees (hotel_id, idEmploye, nom, prenom, poste, salaire, horaire)
       VALUES
       (1, 'EMP001', 'Haddad', 'Omar', 'Reception', 4500, '08:00-16:00'),
       (1, 'EMP002', 'Karim', 'Nadia', 'Gouvernante', 5200, '09:00-17:00')`
    );
  }
};

module.exports = {
  db,
  run,
  get,
  all,
  init,
};
