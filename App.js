import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import AdminRoomsScreen from './src/screens/AdminRoomsScreen';
import AdminEmployeesScreen from './src/screens/AdminEmployeesScreen';
import AdminServicesScreen from './src/screens/AdminServicesScreen';
import AdminReservationsScreen from './src/screens/AdminReservationsScreen';
import AdminStatsScreen from './src/screens/AdminStatsScreen';
import ClientHomeScreen from './src/screens/ClientHomeScreen';
import RoomDetailsScreen from './src/screens/RoomDetailsScreen';
import ReservationCreateScreen from './src/screens/ReservationCreateScreen';
import ReservationListScreen from './src/screens/ReservationListScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AdminTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Chambres" component={AdminRoomsScreen} />
    <Tab.Screen name="Services" component={AdminServicesScreen} />
    <Tab.Screen name="Employés" component={AdminEmployeesScreen} />
    <Tab.Screen name="Réservations" component={AdminReservationsScreen} />
    <Tab.Screen name="Stats" component={AdminStatsScreen} />
  </Tab.Navigator>
);

const ClientStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ClientHome" component={ClientHomeScreen} options={{ title: 'Accueil' }} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={{ title: 'Chambre' }} />
    <Stack.Screen
      name="ReservationCreate"
      component={ReservationCreateScreen}
      options={{ title: 'Réserver' }}
    />
    <Stack.Screen name="ReservationList" component={ReservationListScreen} options={{ title: 'Réservations' }} />
    <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ title: 'Facture' }} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { state, signOut } = useContext(AuthContext);

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.token ? (
        <Stack.Navigator>
          {state.role === 'admin' ? (
            <Stack.Screen
              name="AdminDashboard"
              component={AdminTabs}
              options={{ title: 'Backoffice', headerRight: () => null }}
            />
          ) : (
            <Stack.Screen name="Client" component={ClientStack} options={{ headerShown: false }} />
          )}
          <Stack.Screen
            name="ReservationList"
            component={ReservationListScreen}
            options={{ title: 'Réservations' }}
          />
          <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ title: 'Facture' }} />
          <Stack.Screen
            name="Logout"
            component={LoginScreen}
            options={{
              headerRight: () => null,
              headerLeft: () => null,
              headerTitle: 'Déconnexion',
              headerBackVisible: false,
            }}
            listeners={{
              focus: () => signOut(),
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
