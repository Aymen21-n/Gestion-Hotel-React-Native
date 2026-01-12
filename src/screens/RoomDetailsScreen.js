import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import Header from '../components/Header';

const RoomDetailsScreen = ({ route, navigation }) => {
  const { room } = route.params;

  return (
    <View style={styles.container}>
      <Header title={`Chambre ${room.numero}`} subtitle="Détails de la chambre" />
      <AppButton
        title="Voir données validées"
        variant="secondary"
        onPress={() => navigation.navigate('ValidatedData')}
      />
      <Card>
        <Text style={styles.label}>Catégorie: {room.categorie}</Text>
        <Text style={styles.label}>Étage: {room.etage}</Text>
        <Text style={styles.label}>Prix: {room.prixParNuit} MAD / nuit</Text>
        <Text style={styles.label}>Statut: {room.estReserve ? 'Réservée' : 'Libre'}</Text>
      </Card>
      <AppButton
        title="Réserver"
        onPress={() => navigation.navigate('ReservationCreate', { room })}
        disabled={room.estReserve}
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
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
});

export default RoomDetailsScreen;
