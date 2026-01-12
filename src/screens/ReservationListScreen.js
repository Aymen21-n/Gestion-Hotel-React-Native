import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { cancelReservation, fetchReservations, generateInvoice } from '../services/hotelService';

const ReservationListScreen = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    try {
      const data = await fetchReservations();
      const filtered = state.role === 'client'
        ? data.filter((item) => item.client_id === state.profile?.id)
        : data;
      setReservations(filtered);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      await loadReservations();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleInvoice = async (reservationId) => {
    try {
      await generateInvoice({ reservation_id: reservationId, modePaiement: 'Carte' });
      navigation.navigate('Invoice', { reservationId });
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Mes réservations" subtitle="Suivi et factures" />
      <AppButton
        title="Voir données validées"
        variant="secondary"
        onPress={() => navigation.navigate('ValidatedData')}
      />
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>
              Chambre {item.numero} ({item.categorie})
            </Text>
            <Text>
              Dates: {item.dateDebut} → {item.dateFin}
            </Text>
            <Text>Montant: {item.montant} MAD</Text>
            <Text>Statut: {item.statut}</Text>
            {item.statut !== 'ANNULEE' ? (
              <AppButton title="Annuler" variant="secondary" onPress={() => handleCancel(item.id)} />
            ) : null}
            {item.statut === 'CONFIRMEE' ? (
              <AppButton title="Voir facture" onPress={() => handleInvoice(item.id)} />
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

export default ReservationListScreen;
