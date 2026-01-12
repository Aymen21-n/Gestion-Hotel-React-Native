import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { fetchStats } from '../services/hotelService';

const AdminStatsScreen = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
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
      <Card>
        <Text style={styles.value}>Chambres: {stats.nombreChambres}</Text>
        <Text style={styles.value}>Réservations: {stats.nombreReservations}</Text>
        <Text style={styles.value}>Taux d'occupation: {stats.tauxOccupation}%</Text>
        <Text style={styles.value}>Total facturé: {stats.totalFacture} MAD</Text>
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
  value: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
});

export default AdminStatsScreen;
