import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const FormInput = ({ label, ...props }) => (
  <View style={styles.container}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput style={styles.input} placeholderTextColor="#9e9e9e" {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#2e3a59',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d7e2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});

export default FormInput;
