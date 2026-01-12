import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { createEmployee, fetchEmployees } from '../services/hotelService';

const AdminEmployeesScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    idEmploye: '',
    nom: '',
    prenom: '',
    poste: '',
    salaire: '',
    horaire: '',
  });
  const [loading, setLoading] = useState(false);

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createEmployee({
        hotel_id: 1,
        idEmploye: form.idEmploye,
        nom: form.nom,
        prenom: form.prenom,
        poste: form.poste,
        salaire: Number(form.salaire),
        horaire: form.horaire,
      });
      setForm({ idEmploye: '', nom: '', prenom: '', poste: '', salaire: '', horaire: '' });
      await loadEmployees();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Employés" subtitle="Gestion des équipes" />
      <Card>
        <FormInput label="ID Employé" value={form.idEmploye} onChangeText={(value) => setForm({ ...form, idEmploye: value })} />
        <FormInput label="Nom" value={form.nom} onChangeText={(value) => setForm({ ...form, nom: value })} />
        <FormInput label="Prénom" value={form.prenom} onChangeText={(value) => setForm({ ...form, prenom: value })} />
        <FormInput label="Poste" value={form.poste} onChangeText={(value) => setForm({ ...form, poste: value })} />
        <FormInput
          label="Salaire"
          value={form.salaire}
          onChangeText={(value) => setForm({ ...form, salaire: value })}
          keyboardType="numeric"
        />
        <FormInput label="Horaire" value={form.horaire} onChangeText={(value) => setForm({ ...form, horaire: value })} />
        <AppButton title={loading ? 'Enregistrement...' : 'Ajouter'} onPress={handleCreate} disabled={loading} />
      </Card>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>
              {item.prenom} {item.nom}
            </Text>
            <Text>Poste: {item.poste}</Text>
            <Text>Salaire: {item.salaire} MAD</Text>
            <Text>Horaire: {item.horaire}</Text>
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

export default AdminEmployeesScreen;
