import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { createService, fetchServices } from '../services/hotelService';

const AdminServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    type: 'Spa',
    nomService: '',
    horaireOuverture: '',
    horaireFermeture: '',
    prixService: '',
  });
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createService({
        hotel_id: 1,
        type: form.type,
        nomService: form.nomService,
        horaireOuverture: form.horaireOuverture,
        horaireFermeture: form.horaireFermeture,
        prixService: Number(form.prixService),
      });
      setForm({ type: 'Spa', nomService: '', horaireOuverture: '', horaireFermeture: '', prixService: '' });
      await loadServices();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={services}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <>
          <Header title="Services" subtitle="Ajouter un service" />
          <AppButton
            title="Voir données validées"
            variant="secondary"
            onPress={() => navigation.navigate('ValidatedData')}
          />
          <Card>
            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                <Picker.Item label="Spa" value="Spa" />
                <Picker.Item label="Restauration" value="Restauration" />
                <Picker.Item label="Piscine" value="Piscine" />
                <Picker.Item label="SalleDeSport" value="SalleDeSport" />
                <Picker.Item label="Club" value="Club" />
              </Picker>
            </View>
            <FormInput
              label="Nom"
              value={form.nomService}
              onChangeText={(value) => setForm({ ...form, nomService: value })}
            />
            <FormInput
              label="Ouverture"
              value={form.horaireOuverture}
              onChangeText={(value) => setForm({ ...form, horaireOuverture: value })}
              placeholder="09:00"
            />
            <FormInput
              label="Fermeture"
              value={form.horaireFermeture}
              onChangeText={(value) => setForm({ ...form, horaireFermeture: value })}
              placeholder="20:00"
            />
            <FormInput
              label="Prix du service"
              value={form.prixService}
              onChangeText={(value) => setForm({ ...form, prixService: value })}
              keyboardType="numeric"
            />
            <AppButton title={loading ? 'Enregistrement...' : 'Ajouter'} onPress={handleCreate} disabled={loading} />
          </Card>
        </>
      }
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.title}>{item.nomService}</Text>
          <Text>Type: {item.type}</Text>
          <Text>
            Horaires: {item.horaireOuverture} - {item.horaireFermeture}
          </Text>
          <Text>Prix: {item.prixService} MAD</Text>
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

export default AdminServicesScreen;
