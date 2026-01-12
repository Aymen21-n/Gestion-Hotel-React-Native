import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const { signInAdmin, signInClient } = useContext(AuthContext);
  const [mode, setMode] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cin, setCin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (mode === 'admin') {
        await signInAdmin(email, password);
      } else {
        await signInClient(cin, email);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gestion d'Hôtel"
        subtitle="Connectez-vous en tant qu'administrateur ou client"
      />
      <View style={styles.toggle}>
        <AppButton
          title="Admin"
          variant={mode === 'admin' ? 'primary' : 'secondary'}
          onPress={() => setMode('admin')}
        />
        <AppButton
          title="Client"
          variant={mode === 'client' ? 'primary' : 'secondary'}
          onPress={() => setMode('client')}
        />
      </View>
      {mode === 'client' ? (
        <FormInput label="CIN" value={cin} onChangeText={setCin} />
      ) : null}
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {mode === 'admin' ? (
        <FormInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      ) : null}
      <AppButton title={loading ? 'Connexion...' : 'Se connecter'} onPress={handleLogin} disabled={loading} />
      <Text style={styles.helper}>Admin: admin@hotel.com / admin123</Text>
      <Text style={styles.helper}>Client: sara@client.com / CIN AB12345</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6fb',
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    color: '#7a8699',
  },
});

export default LoginScreen;
