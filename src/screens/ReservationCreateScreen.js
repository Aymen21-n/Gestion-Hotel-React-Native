import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { createReservation } from '../services/hotelService';

const ReservationCreateScreen = ({ route, navigation }) => {
  const { room } = route.params;
  const { state } = useContext(AuthContext);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [typeReservation, setTypeReservation] = useState('Standard');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const reservation = await createReservation({
        room_id: room.id,
        client_id: state.profile?.id,
        dateDebut,
        dateFin,
        typeReservation,
      });
      Alert.alert('Succès', 'Réservation créée.');
      navigation.navigate('ReservationList', { focusReservationId: reservation.id });
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Nouvelle réservation" subtitle={`Chambre ${room.numero}`} />
      <Card>
        <Text style={styles.label}>Prix: {room.prixParNuit} MAD / nuit</Text>
        <FormInput label="Date début (YYYY-MM-DD)" value={dateDebut} onChangeText={setDateDebut} />
        <FormInput label="Date fin (YYYY-MM-DD)" value={dateFin} onChangeText={setDateFin} />
        <FormInput label="Type" value={typeReservation} onChangeText={setTypeReservation} />
        <AppButton
          title={loading ? 'Envoi...' : 'Confirmer la réservation'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  label: {
    marginBottom: 12,
    fontWeight: '600',
  },
});

export default ReservationCreateScreen;
