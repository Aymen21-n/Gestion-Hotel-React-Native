import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { createReservation, fetchServices } from '../services/hotelService';

const ReservationCreateScreen = ({ route, navigation }) => {
  const { room } = route.params;
  const { state } = useContext(AuthContext);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [typeReservation, setTypeReservation] = useState('Standard');
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        Alert.alert('Erreur', error.message);
      }
    };
    loadServices();
  }, []);

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const reservation = await createReservation({
        room_id: room.id,
        client_id: state.profile?.id,
        dateDebut,
        dateFin,
        typeReservation,
        serviceIds: selectedServices,
      });
      Alert.alert('Succès', 'Réservation créée.');
      navigation.navigate('ReservationList', { focusReservationId: reservation.id });
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Nouvelle réservation" subtitle={`Chambre ${room.numero}`} />
      <AppButton
        title="Voir données validées"
        variant="secondary"
        onPress={() => navigation.navigate('ValidatedData')}
      />
      <Card>
        <Text style={styles.label}>Prix: {room.prixParNuit} MAD / nuit</Text>
        <FormInput label="Date début (YYYY-MM-DD)" value={dateDebut} onChangeText={setDateDebut} />
        <FormInput label="Date fin (YYYY-MM-DD)" value={dateFin} onChangeText={setDateFin} />
        <FormInput label="Type" value={typeReservation} onChangeText={setTypeReservation} />
        <Text style={styles.label}>Services optionnels</Text>
        {services.map((service) => {
          const selected = selectedServices.includes(service.id);
          return (
            <Pressable
              key={service.id}
              style={[styles.serviceRow, selected && styles.serviceRowSelected]}
              onPress={() => toggleService(service.id)}
            >
              <Text style={styles.serviceText}>
                {service.nomService} ({service.type}) - {service.prixService} MAD
              </Text>
            </Pressable>
          );
        })}
        <AppButton
          title={loading ? 'Envoi...' : 'Confirmer la réservation'}
          onPress={handleSubmit}
          disabled={loading}
        />
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
    marginBottom: 12,
    fontWeight: '600',
  },
  serviceRow: {
    borderWidth: 1,
    borderColor: '#d0d7e2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  serviceRowSelected: {
    borderColor: '#1e88e5',
    backgroundColor: '#e8f1fd',
  },
  serviceText: {
    color: '#1e2a3a',
  },
});

export default ReservationCreateScreen;
