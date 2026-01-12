import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { createRoom, fetchRooms } from '../services/hotelService';

const AdminRoomsScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ numero: '', categorie: 'Standard', etage: '', prixParNuit: '' });
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
      setForm({ numero: '', categorie: 'Standard', etage: '', prixParNuit: '' });
      await loadRooms();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={rooms}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <>
          <Header title="Chambres" subtitle="Créer et consulter les chambres" />
          <AppButton
            title="Voir données validées"
            variant="secondary"
            onPress={() => navigation.navigate('ValidatedData')}
          />
          <Card>
            <FormInput
              label="Numéro"
              value={form.numero}
              onChangeText={(value) => setForm({ ...form, numero: value })}
            />
            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.categorie}
                onValueChange={(value) => setForm({ ...form, categorie: value })}
              >
                <Picker.Item label="Standard" value="Standard" />
                <Picker.Item label="Deluxe" value="Deluxe" />
                <Picker.Item label="Suite" value="Suite" />
              </Picker>
            </View>
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
        </>
      }
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#2e3a59',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d0d7e2',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
  },
});

export default AdminRoomsScreen;
