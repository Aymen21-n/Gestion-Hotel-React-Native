import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate('Logout')} style={styles.button}>
      <Text style={styles.text}>Déconnexion</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
  },
  text: {
    color: '#1e88e5',
    fontWeight: '600',
  },
});

export default LogoutButton;
