/**
 * @typedef {Object} Hotel
 * @property {number} id
 * @property {string} nom
 * @property {string} adresse
 * @property {number} note
 * @property {string} telephone
 * @property {number} nbChambres
 */

/**
 * @typedef {Object} Chambre
 * @property {number} id
 * @property {string} numero
 * @property {string} categorie
 * @property {number} etage
 * @property {boolean} estReserve
 * @property {number} prixParNuit
 */

/**
 * @typedef {Object} Employe
 * @property {number} id
 * @property {string} idEmploye
 * @property {string} nom
 * @property {string} prenom
 * @property {string} poste
 * @property {number} salaire
 * @property {string} horaire
 */

/**
 * @typedef {Object} Service
 * @property {number} id
 * @property {string} type
 * @property {string} nomService
 * @property {string} horaireOuverture
 * @property {string} horaireFermeture
 */

/**
 * @typedef {Object} Client
 * @property {number} id
 * @property {string} cin
 * @property {string} nom
 * @property {string} prenom
 * @property {string} telephone
 * @property {string} email
 */

/**
 * @typedef {Object} Reservation
 * @property {number} id
 * @property {string} dateDebut
 * @property {string} dateFin
 * @property {string} typeReservation
 * @property {string} statut
 * @property {number} montant
 */

/**
 * @typedef {Object} Facture
 * @property {number} id
 * @property {number} reservation_id
 * @property {string} dateFacture
 * @property {number} montantTotal
 * @property {string} modePaiement
 */

export const modelInfo = {};
