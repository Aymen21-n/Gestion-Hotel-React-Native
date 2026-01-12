import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import Header from '../components/Header';
import { confirmReservation, fetchReservations, generateInvoice } from '../services/hotelService';

const AdminReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    try {
      const data = await fetchReservations();
      setReservations(data);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleConfirm = async (reservationId) => {
    try {
      await confirmReservation(reservationId);
      await generateInvoice({ reservation_id: reservationId, modePaiement: 'Carte' });
      await loadReservations();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Réservations" subtitle="Valider les demandes" />
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>
              Chambre {item.numero} - {item.categorie}
            </Text>
            <Text>
              Client: {item.clientPrenom} {item.clientNom}
            </Text>
            <Text>
              Dates: {item.dateDebut} → {item.dateFin}
            </Text>
            <Text>Montant: {item.montant} MAD</Text>
            <Text>Statut: {item.statut}</Text>
            {item.statut === 'EN_ATTENTE' ? (
              <AppButton title="Confirmer" onPress={() => handleConfirm(item.id)} />
            ) : null}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
  },
});

export default AdminReservationsScreen;
