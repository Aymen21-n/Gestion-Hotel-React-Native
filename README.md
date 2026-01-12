# Gestion d'Hôtel (React Native + Expo)

Application mobile de gestion d'hôtel avec API Express + SQLite. Le projet respecte le modèle métier demandé (Hôtel, Chambre, Employé, Service, Client, Réservation, Facture) et fournit une architecture claire côté mobile et serveur.

## Architecture

```
server/
  controllers/
  db/
  routes/
  index.js
  package.json
src/
  components/
  context/
  models/
  screens/
  services/
```

## Schéma DB (SQLite)

Tables principales :

- `hotels` (nom, adresse, note, telephone, nbChambres)
- `rooms` (numero, categorie, etage, estReserve, prixParNuit, hotel_id)
- `employees` (idEmploye, nom, prenom, poste, salaire, horaire, hotel_id)
- `services` (type + champs spécifiques, nomService, horaires, hotel_id)
- `reservation_services` (reservation_id, service_id) pour les services optionnels
- `clients` (cin, nom, prenom, telephone, email)
- `reservations` (dateDebut, dateFin, typeReservation, statut, montant, room_id, client_id)
- `invoices` (dateFacture, montantTotal, modePaiement, reservation_id)
- `admins` (emailAdmin, motDePasse)

Relations :
- `rooms`, `employees`, `services` → `hotels`
- `reservations` → `rooms`, `clients`
- `invoices` → `reservations`
- `reservation_services` → `reservations`, `services`

## Endpoints principaux

```
POST   /auth/admin/login
POST   /auth/client/login
GET    /rooms
POST   /rooms
PUT    /rooms/:id
DELETE /rooms/:id
GET    /employees
POST   /employees
PUT    /employees/:id
DELETE /employees/:id
GET    /services
POST   /services
PUT    /services/:id
DELETE /services/:id
GET    /clients
POST   /clients
GET    /reservations
POST   /reservations
POST   /reservations/:id/confirm
POST   /reservations/:id/cancel
GET    /invoices/:reservationId
POST   /invoices/generate
GET    /stats
```

## Fonctionnalités clés

- Authentification Admin et Client (CIN + email ou email seul).
- CRUD Chambres, Employés, Services (admin).
- Réservations avec validation (statuts EN_ATTENTE / CONFIRMEE / ANNULEE).
- Services optionnels ajoutés à la réservation (montant total = nuits * prix + services).
- Facture générée après confirmation (vue client).
- Statistiques + liste des clients côté admin.

## Seed de données

Le serveur initialise :
- 1 hôtel (Hotel Atlas)
- 1 admin (admin@hotel.com / admin123)
- 1 client (morad@gmail.com / CIN AB12345)
- Plusieurs chambres, services et employés

## Installation

### 1) API (Express + SQLite)

```bash
cd server
npm install
npm run start
```

Le serveur démarre sur `http://localhost:3001`.

### 2) Mobile (Expo)

```bash
npm install
npm run start
```

> ⚠️ Pour Expo sur mobile, utilisez `EXPO_PUBLIC_API_URL` (ex: `http://192.168.1.10:3001`) ou mettez à jour `src/services/api.js`.

#### Exemple Windows (PowerShell)
```powershell
$env:EXPO_PUBLIC_API_URL="http://192.168.1.10:3001"
npm run start
```

### 3) Créer un compte client (test)

Dans l'écran Login, choisissez **Client** puis cliquez sur **Créer un compte client**.
Le compte est enregistré via `POST /clients` et vous pouvez vous connecter ensuite.

## Identifiants de test

- Admin : `admin@hotel.com` / `admin123`
- Client : `morad@gmail.com` / CIN `AB12345`

## Notes

- Calcul montant réservation = nombre de nuits * prix par nuit.
- Vérification des chevauchements de dates.
- Confirmation réservation → facture générée côté admin.
- Bouton de déconnexion disponible pour revenir à l'écran Login.
- Écran "Données validées" accessible depuis les pages principales (chambres/services/employés/réservations confirmées).
- Lors d'une réservation, le client peut ajouter des services optionnels (impact sur le montant et la facture).
