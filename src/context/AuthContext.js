import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginAdmin, loginClient } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoading: true,
    token: null,
    role: null,
    profile: null,
  });

  useEffect(() => {
    const bootstrap = async () => {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      const profile = await AsyncStorage.getItem('profile');
      setState({
        isLoading: false,
        token,
        role,
        profile: profile ? JSON.parse(profile) : null,
      });
    };
    bootstrap();
  }, []);

  const authContext = useMemo(
    () => ({
      state,
      signInAdmin: async (emailAdmin, motDePasse) => {
        const data = await loginAdmin(emailAdmin, motDePasse);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('role', data.role);
        await AsyncStorage.setItem('profile', JSON.stringify(data.admin));
        setState({ isLoading: false, token: data.token, role: data.role, profile: data.admin });
      },
      signInClient: async (cin, email) => {
        const data = await loginClient(cin, email);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('role', data.role);
        await AsyncStorage.setItem('profile', JSON.stringify(data.client));
        setState({ isLoading: false, token: data.token, role: data.role, profile: data.client });
      },
      signOut: async () => {
        await AsyncStorage.multiRemove(['token', 'role', 'profile']);
        setState({ isLoading: false, token: null, role: null, profile: null });
      },
    }),
    [state]
  );

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};
