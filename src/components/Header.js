import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e2a3a',
  },
  subtitle: {
    color: '#62718a',
    marginTop: 4,
  },
});

export default Header;
