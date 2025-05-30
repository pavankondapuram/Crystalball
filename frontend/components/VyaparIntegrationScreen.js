import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { connectVyapar } from '../services/api'; // To be created in api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const VYAPAR_INTEGRATED_KEY = 'vyaparIntegrated'; // Key to store integration status

export default function VyaparIntegrationScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIntegrate = async () => {
    if (!apiKey.trim() || !businessName.trim()) {
      Alert.alert('Error', 'Please enter both API Key and Business Name.');
      return;
    }
    setLoading(true);
    try {
      const response = await connectVyapar({ apiKey, businessName });
      if (response && response.success) {
        // Store a flag indicating successful integration
        await AsyncStorage.setItem(VYAPAR_INTEGRATED_KEY, 'true');
        // Optionally store session token if backend provides it and it's needed client-side
        // if (response.sessionToken) { 
        //   await AsyncStorage.setItem('vyaparSessionToken', response.sessionToken);
        // }
        Alert.alert('Success', response.message || 'Vyapar integration successful!');
        // Navigate to Inventory Display or back to Dashboard/Settings
        navigation.navigate('InventoryDisplay'); // Or 'Dashboard'
      } else {
        Alert.alert('Integration Failed', response.message || 'Could not connect to Vyapar. Please check credentials and try again.');
      }
    } catch (error) {
      console.error('Vyapar Integration Error:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred during Vyapar integration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integrate with Vyapar</Text>
      <Text style={styles.label}>Vyapar API Key:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Vyapar API Key"
        value={apiKey}
        onChangeText={setApiKey}
        editable={!loading}
        secureTextEntry // API keys should be treated as sensitive
      />
      <Text style={styles.label}>Vyapar Business Name/ID:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Vyapar Business Name or Identifier"
        value={businessName}
        onChangeText={setBusinessName}
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Connect to Vyapar"
          onPress={handleIntegrate}
        />
      )}
      <Button
        title="Skip / Go to Inventory (if already integrated)"
        onPress={() => navigation.navigate('InventoryDisplay')}
        color="#888" // Secondary action
        style={styles.skipButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 5,
  },
  skipButton: {
    marginTop: 10,
  }
});
