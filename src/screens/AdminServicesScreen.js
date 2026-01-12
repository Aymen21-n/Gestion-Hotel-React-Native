import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { createService, fetchServices } from '../services/hotelService';

const AdminServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    type: 'Spa',
    nomService: '',
    horaireOuverture: '',
    horaireFermeture: '',
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
      });
      setForm({ type: 'Spa', nomService: '', horaireOuverture: '', horaireFermeture: '' });
      await loadServices();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Services" subtitle="Ajouter un service" />
      <Card>
        <FormInput label="Type" value={form.type} onChangeText={(value) => setForm({ ...form, type: value })} />
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
        <AppButton title={loading ? 'Enregistrement...' : 'Ajouter'} onPress={handleCreate} disabled={loading} />
      </Card>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>{item.nomService}</Text>
            <Text>Type: {item.type}</Text>
            <Text>
              Horaires: {item.horaireOuverture} - {item.horaireFermeture}
            </Text>
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

export default AdminServicesScreen;
