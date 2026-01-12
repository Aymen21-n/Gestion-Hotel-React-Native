import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { createClient } from '../services/hotelService';

const ClientRegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    cin: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!form.cin || !form.nom || !form.prenom || !form.email) {
        Alert.alert('Validation', 'Veuillez remplir tous les champs obligatoires.');
        return;
      }
      setLoading(true);
      const payload = {
        cin: form.cin.trim(),
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim().toLowerCase(),
      };
      if (!payload.cin || !payload.nom || !payload.prenom || !payload.email) {
        Alert.alert('Validation', 'Veuillez remplir tous les champs obligatoires.');
        return;
      }
      await createClient(payload);
      Alert.alert('Succès', 'Compte client créé. Vous pouvez vous connecter.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Inscription client" subtitle="Créer un nouveau compte" />
      <Card>
        <FormInput label="CIN" value={form.cin} onChangeText={(value) => setForm({ ...form, cin: value })} />
        <FormInput label="Nom" value={form.nom} onChangeText={(value) => setForm({ ...form, nom: value })} />
        <FormInput label="Prénom" value={form.prenom} onChangeText={(value) => setForm({ ...form, prenom: value })} />
        <FormInput
          label="Téléphone"
          value={form.telephone}
          onChangeText={(value) => setForm({ ...form, telephone: value })}
          keyboardType="phone-pad"
        />
        <FormInput
          label="Email"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AppButton title={loading ? 'Création...' : 'Créer le compte'} onPress={handleRegister} disabled={loading} />
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
});

export default ClientRegisterScreen;
