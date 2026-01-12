import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import {
  deleteEmployee,
  deleteRoom,
  deleteService,
  fetchEmployees,
  fetchReservations,
  fetchRooms,
  fetchServices,
  updateEmployee,
  updateRoom,
  updateService,
} from '../services/hotelService';

const ValidatedDataScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [roomDraft, setRoomDraft] = useState({});
  const [serviceDraft, setServiceDraft] = useState({});
  const [employeeDraft, setEmployeeDraft] = useState({});

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

  const refreshData = async () => {
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

  const handleRoomEdit = (room) => {
    setEditingRoomId(room.id);
    setRoomDraft({
      numero: room.numero,
      categorie: room.categorie,
      etage: String(room.etage),
      prixParNuit: String(room.prixParNuit),
      estReserve: room.estReserve ? 1 : 0,
    });
  };

  const handleServiceEdit = (service) => {
    setEditingServiceId(service.id);
    setServiceDraft({
      nomService: service.nomService,
      type: service.type,
      horaireOuverture: service.horaireOuverture,
      horaireFermeture: service.horaireFermeture,
      prixService: String(service.prixService || 0),
    });
  };

  const handleEmployeeEdit = (employee) => {
    setEditingEmployeeId(employee.id);
    setEmployeeDraft({
      nom: employee.nom,
      prenom: employee.prenom,
      poste: employee.poste,
      salaire: String(employee.salaire),
      horaire: employee.horaire,
    });
  };

  const saveRoom = async (roomId) => {
    try {
      await updateRoom(roomId, {
        numero: roomDraft.numero,
        categorie: roomDraft.categorie,
        etage: Number(roomDraft.etage),
        estReserve: roomDraft.estReserve,
        prixParNuit: Number(roomDraft.prixParNuit),
      });
      setEditingRoomId(null);
      await refreshData();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const saveService = async (serviceId) => {
    try {
      await updateService(serviceId, {
        type: serviceDraft.type,
        nomService: serviceDraft.nomService,
        horaireOuverture: serviceDraft.horaireOuverture,
        horaireFermeture: serviceDraft.horaireFermeture,
        prixService: Number(serviceDraft.prixService),
      });
      setEditingServiceId(null);
      await refreshData();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const saveEmployee = async (employeeId) => {
    try {
      await updateEmployee(employeeId, {
        nom: employeeDraft.nom,
        prenom: employeeDraft.prenom,
        poste: employeeDraft.poste,
        salaire: Number(employeeDraft.salaire),
        horaire: employeeDraft.horaire,
      });
      setEditingEmployeeId(null);
      await refreshData();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'room') {
        await deleteRoom(id);
      } else if (type === 'service') {
        await deleteService(id);
      } else if (type === 'employee') {
        await deleteEmployee(id);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
      return;
    }
    await refreshData();
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Données validées" subtitle="Chambres, services, employés, réservations confirmées" />

      <Text style={styles.sectionTitle}>Chambres</Text>
      {rooms.map((room) => (
        <Card key={`room-${room.id}`}>
          {editingRoomId === room.id ? (
            <>
              <FormInput
                label="Numéro"
                value={roomDraft.numero}
                onChangeText={(value) => setRoomDraft((prev) => ({ ...prev, numero: value }))}
              />
              <FormInput
                label="Catégorie"
                value={roomDraft.categorie}
                onChangeText={(value) => setRoomDraft((prev) => ({ ...prev, categorie: value }))}
              />
              <FormInput
                label="Étage"
                value={roomDraft.etage}
                onChangeText={(value) => setRoomDraft((prev) => ({ ...prev, etage: value }))}
                keyboardType="numeric"
              />
              <FormInput
                label="Prix"
                value={roomDraft.prixParNuit}
                onChangeText={(value) => setRoomDraft((prev) => ({ ...prev, prixParNuit: value }))}
                keyboardType="numeric"
              />
              <AppButton title="Enregistrer" onPress={() => saveRoom(room.id)} />
              <AppButton title="Annuler" variant="secondary" onPress={() => setEditingRoomId(null)} />
            </>
          ) : (
            <>
              <Text style={styles.itemTitle}>Chambre {room.numero}</Text>
              <Text>Catégorie: {room.categorie}</Text>
              <Text>Étage: {room.etage}</Text>
              <Text>Prix: {room.prixParNuit} MAD</Text>
              <AppButton title="Modifier" onPress={() => handleRoomEdit(room)} />
              <AppButton title="Supprimer" variant="secondary" onPress={() => handleDelete('room', room.id)} />
            </>
          )}
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Services</Text>
      {services.map((service) => (
        <Card key={`service-${service.id}`}>
          {editingServiceId === service.id ? (
            <>
              <FormInput
                label="Nom"
                value={serviceDraft.nomService}
                onChangeText={(value) => setServiceDraft((prev) => ({ ...prev, nomService: value }))}
              />
              <FormInput
                label="Type"
                value={serviceDraft.type}
                onChangeText={(value) => setServiceDraft((prev) => ({ ...prev, type: value }))}
              />
              <FormInput
                label="Ouverture"
                value={serviceDraft.horaireOuverture}
                onChangeText={(value) => setServiceDraft((prev) => ({ ...prev, horaireOuverture: value }))}
              />
              <FormInput
                label="Fermeture"
                value={serviceDraft.horaireFermeture}
                onChangeText={(value) => setServiceDraft((prev) => ({ ...prev, horaireFermeture: value }))}
              />
              <FormInput
                label="Prix"
                value={serviceDraft.prixService}
                onChangeText={(value) => setServiceDraft((prev) => ({ ...prev, prixService: value }))}
                keyboardType="numeric"
              />
              <AppButton title="Enregistrer" onPress={() => saveService(service.id)} />
              <AppButton title="Annuler" variant="secondary" onPress={() => setEditingServiceId(null)} />
            </>
          ) : (
            <>
              <Text style={styles.itemTitle}>{service.nomService}</Text>
              <Text>Type: {service.type}</Text>
              <Text>
                Horaires: {service.horaireOuverture} - {service.horaireFermeture}
              </Text>
              <Text>Prix: {service.prixService} MAD</Text>
              <AppButton title="Modifier" onPress={() => handleServiceEdit(service)} />
              <AppButton title="Supprimer" variant="secondary" onPress={() => handleDelete('service', service.id)} />
            </>
          )}
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Employés</Text>
      {employees.map((employee) => (
        <Card key={`employee-${employee.id}`}>
          {editingEmployeeId === employee.id ? (
            <>
              <FormInput
                label="Nom"
                value={employeeDraft.nom}
                onChangeText={(value) => setEmployeeDraft((prev) => ({ ...prev, nom: value }))}
              />
              <FormInput
                label="Prénom"
                value={employeeDraft.prenom}
                onChangeText={(value) => setEmployeeDraft((prev) => ({ ...prev, prenom: value }))}
              />
              <FormInput
                label="Poste"
                value={employeeDraft.poste}
                onChangeText={(value) => setEmployeeDraft((prev) => ({ ...prev, poste: value }))}
              />
              <FormInput
                label="Salaire"
                value={employeeDraft.salaire}
                onChangeText={(value) => setEmployeeDraft((prev) => ({ ...prev, salaire: value }))}
                keyboardType="numeric"
              />
              <FormInput
                label="Horaire"
                value={employeeDraft.horaire}
                onChangeText={(value) => setEmployeeDraft((prev) => ({ ...prev, horaire: value }))}
              />
              <AppButton title="Enregistrer" onPress={() => saveEmployee(employee.id)} />
              <AppButton title="Annuler" variant="secondary" onPress={() => setEditingEmployeeId(null)} />
            </>
          ) : (
            <>
              <Text style={styles.itemTitle}>
                {employee.prenom} {employee.nom}
              </Text>
              <Text>Poste: {employee.poste}</Text>
              <Text>Horaire: {employee.horaire}</Text>
              <AppButton title="Modifier" onPress={() => handleEmployeeEdit(employee)} />
              <AppButton title="Supprimer" variant="secondary" onPress={() => handleDelete('employee', employee.id)} />
            </>
          )}
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
