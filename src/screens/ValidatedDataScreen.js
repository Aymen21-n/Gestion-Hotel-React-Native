import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { fetchEmployees, fetchReservations, fetchRooms, fetchServices } from '../services/hotelService';

const ValidatedDataScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, servicesData, employeesData, reservationsData] = await Promise.all([
          fetchRooms(),
          fetchServices(),
          fetchEmployees(),
          fetchReservations(),
        ]);
        setRooms(roomsData);
        setServices(servicesData);
        setEmployees(employeesData);
        setReservations(reservationsData.filter((item) => item.statut === 'CONFIRMEE'));
      } catch (error) {
        Alert.alert('Erreur', error.message);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header title="Données validées" subtitle="Chambres, services, employés, réservations confirmées" />

      <Text style={styles.sectionTitle}>Chambres</Text>
      {rooms.map((room) => (
        <Card key={`room-${room.id}`}>
          <Text style={styles.itemTitle}>Chambre {room.numero}</Text>
          <Text>Catégorie: {room.categorie}</Text>
          <Text>Étage: {room.etage}</Text>
          <Text>Prix: {room.prixParNuit} MAD</Text>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Services</Text>
      {services.map((service) => (
        <Card key={`service-${service.id}`}>
          <Text style={styles.itemTitle}>{service.nomService}</Text>
          <Text>Type: {service.type}</Text>
          <Text>
            Horaires: {service.horaireOuverture} - {service.horaireFermeture}
          </Text>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Employés</Text>
      {employees.map((employee) => (
        <Card key={`employee-${employee.id}`}>
          <Text style={styles.itemTitle}>
            {employee.prenom} {employee.nom}
          </Text>
          <Text>Poste: {employee.poste}</Text>
          <Text>Horaire: {employee.horaire}</Text>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Réservations confirmées</Text>
      {reservations.map((reservation) => (
        <Card key={`reservation-${reservation.id}`}>
          <Text style={styles.itemTitle}>Chambre {reservation.numero}</Text>
          <Text>
            Client: {reservation.clientPrenom} {reservation.clientNom}
          </Text>
          <Text>
            Dates: {reservation.dateDebut} → {reservation.dateFin}
          </Text>
          <Text>Montant: {reservation.montant} MAD</Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
    color: '#1e2a3a',
  },
  itemTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
});

export default ValidatedDataScreen;
