import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const AppButton = ({ title, onPress, variant = 'primary', disabled }) => {
  const isDisabled = Boolean(disabled);
  return (
    <Pressable
      style={[styles.button, styles[variant], isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  primary: {
    backgroundColor: '#1e88e5',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AppButton;
