import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import Header from '../components/Header';
import { fetchRooms } from '../services/hotelService';

const ClientHomeScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (error) {
        Alert.alert('Erreur', error.message);
      }
    };
    loadRooms();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Chambres disponibles" subtitle="Choisissez votre séjour" />
      <AppButton title="Mes réservations" variant="secondary" onPress={() => navigation.navigate('ReservationList')} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>Chambre {item.numero}</Text>
            <Text>Catégorie: {item.categorie}</Text>
            <Text>Étage: {item.etage}</Text>
            <Text>Prix: {item.prixParNuit} MAD</Text>
            <Text>Statut: {item.estReserve ? 'Réservée' : 'Libre'}</Text>
            <AppButton title="Voir détails" onPress={() => navigation.navigate('RoomDetails', { room: item })} />
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

export default ClientHomeScreen;
