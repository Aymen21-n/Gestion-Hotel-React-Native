import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { fetchInvoiceByReservation } from '../services/hotelService';

const InvoiceScreen = ({ route }) => {
  const { reservationId } = route.params;
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceByReservation(reservationId);
        setInvoice(data);
      } catch (error) {
        Alert.alert('Erreur', error.message);
      }
    };
    loadInvoice();
  }, [reservationId]);

  if (!invoice) {
    return (
      <View style={styles.container}>
        <Header title="Facture" subtitle="Chargement..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Facture" subtitle={`Réservation #${invoice.reservation_id}`} />
      <Card>
        <Text style={styles.label}>Date: {invoice.dateFacture}</Text>
        <Text style={styles.label}>Montant: {invoice.montantTotal} MAD</Text>
        <Text style={styles.label}>Mode de paiement: {invoice.modePaiement}</Text>
        <Text style={styles.label}>Statut: {invoice.statut}</Text>
        {invoice.services?.length ? (
          <>
            <Text style={styles.label}>Services:</Text>
            {invoice.services.map((service) => (
              <Text key={service.id} style={styles.serviceItem}>
                - {service.nomService} ({service.type}) : {service.prixService} MAD
              </Text>
            ))}
          </>
        ) : null}
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
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  serviceItem: {
    marginBottom: 4,
    color: '#1e2a3a',
  },
});

export default InvoiceScreen;
