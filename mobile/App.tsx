// App.tsx
// Navegación raíz — dos tabs: Estudiante y Portería.
// En producción P1 maneja el auth y solo muestra la tab correcta según el rol.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import PorteriaScreen from './src/screens/PorteriaScreen';
import { colors, fontSize } from './src/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1A1A2E',
            borderTopColor: '#2D2D4E',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: colors.purple,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="QR Acceso"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📱</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Portería"
          component={PorteriaScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🔍</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
