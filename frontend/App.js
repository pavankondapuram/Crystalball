import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation components (assuming these are installed)
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from './components/Dashboard'; // Will be adapted or part of a stack
import LoginScreen from './components/LoginScreen';
import VyaparIntegrationScreen from './components/VyaparIntegrationScreen';
import InventoryDisplayScreen from './components/InventoryDisplayScreen';

const AUTH_TOKEN_KEY = 'userAuthToken';
const VYAPAR_INTEGRATED_KEY = 'vyaparIntegrated'; // To check if Vyapar setup was done

const Stack = createStackNavigator();

// Main application stack when authenticated
function AppStack({ handleLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        // component={Dashboard} // Dashboard will need navigation prop
        options={{ 
          title: 'Dashboard',
          headerRight: () => (
            <Button onPress={handleLogout} title="Logout" color="#FF0000" />
          ),
        }}
      >
        {/* Render Dashboard and pass navigation, or adapt Dashboard to use useNavigation hook */}
        {props => <Dashboard {...props} />}
      </Stack.Screen>
      <Stack.Screen 
        name="VyaparIntegration" 
        component={VyaparIntegrationScreen} 
        options={{ title: 'Integrate Vyapar' }} 
      />
      <Stack.Screen 
        name="InventoryDisplay" 
        component={InventoryDisplayScreen} 
        options={{ title: 'Vyapar Inventory' }} 
      />
    </Stack.Navigator>
  );
}

// Authentication stack
function AuthStack({ handleLoginSuccess }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ title: 'Login' }}>
        {props => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // We don't necessarily need vyaparIntegrated state here unless App.js directly controls navigation logic based on it.
  // Screens themselves can check AsyncStorage.

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to load auth token', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLoginSuccess = async (token) => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Failed to save auth token', e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      // Optionally clear Vyapar integration status on logout if desired
      // await AsyncStorage.removeItem(VYAPAR_INTEGRATED_KEY);
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Failed to remove auth token', e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading App...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack handleLogout={handleLogout} />
      ) : (
        <AuthStack handleLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Removed previous container, headerText, logoutButtonContainer, logoutButton styles
  // as Navigation components will handle their own styling to a large extent.
  // Specific screen styles are in their respective files.
});
