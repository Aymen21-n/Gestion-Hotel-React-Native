import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import Header from '../components/Header';
import { fetchClients, fetchStats } from '../services/hotelService';

const AdminStatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsData, clientsData] = await Promise.all([fetchStats(), fetchClients()]);
        setStats(statsData);
        setClients(clientsData);
      } catch (error) {
        Alert.alert('Erreur', error.message);
      }
    };
    loadStats();
  }, []);

  if (!stats) {
    return (
      <View style={styles.container}>
        <Header title="Statistiques" subtitle="Chargement..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Statistiques" subtitle="Vue globale des indicateurs" />
      <AppButton
        title="Voir données validées"
        variant="secondary"
        onPress={() => navigation.navigate('ValidatedData')}
      />
      <Card>
        <Text style={styles.value}>Chambres: {stats.nombreChambres}</Text>
        <Text style={styles.value}>Réservations: {stats.nombreReservations}</Text>
        <Text style={styles.value}>Taux d'occupation: {stats.tauxOccupation}%</Text>
        <Text style={styles.value}>Total facturé: {stats.totalFacture} MAD</Text>
      </Card>
      <Header title="Clients" subtitle="Liste des clients enregistrés" />
      {clients.map((client) => (
        <Card key={`client-${client.id}`}>
          <Text style={styles.value}>
            {client.prenom} {client.nom}
          </Text>
          <Text>Email: {client.email}</Text>
          <Text>CIN: {client.cin}</Text>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
});

export default AdminStatsScreen;
