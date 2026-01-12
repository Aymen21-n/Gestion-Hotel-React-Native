import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { createRoom, fetchRooms } from '../services/hotelService';

const AdminRoomsScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ numero: '', categorie: '', etage: '', prixParNuit: '' });
  const [loading, setLoading] = useState(false);

  const loadRooms = async () => {
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createRoom({
        hotel_id: 1,
        numero: form.numero,
        categorie: form.categorie,
        etage: Number(form.etage),
        prixParNuit: Number(form.prixParNuit),
      });
      setForm({ numero: '', categorie: '', etage: '', prixParNuit: '' });
      await loadRooms();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Chambres" subtitle="Créer et consulter les chambres" />
      <Card>
        <FormInput label="Numéro" value={form.numero} onChangeText={(value) => setForm({ ...form, numero: value })} />
        <FormInput label="Catégorie" value={form.categorie} onChangeText={(value) => setForm({ ...form, categorie: value })} />
        <FormInput
          label="Étage"
          value={form.etage}
          onChangeText={(value) => setForm({ ...form, etage: value })}
          keyboardType="numeric"
        />
        <FormInput
          label="Prix par nuit"
          value={form.prixParNuit}
          onChangeText={(value) => setForm({ ...form, prixParNuit: value })}
          keyboardType="numeric"
        />
        <AppButton title={loading ? 'Enregistrement...' : 'Ajouter'} onPress={handleCreate} disabled={loading} />
      </Card>
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

export default AdminRoomsScreen;
