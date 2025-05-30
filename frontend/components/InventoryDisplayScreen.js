import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Button, Alert } from 'react-native';
import { getInventory } from '../services/api'; // To be created in api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const VYAPAR_INTEGRATED_KEY = 'vyaparIntegrated';

export default function InventoryDisplayScreen({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isIntegrated, setIsIntegrated] = useState(false);

  const checkIntegrationStatus = async () => {
    const integrated = await AsyncStorage.getItem(VYAPAR_INTEGRATED_KEY);
    setIsIntegrated(integrated === 'true');
    return integrated === 'true';
  };

  const fetchInventoryData = useCallback(async () => {
    const integrated = await checkIntegrationStatus();
    if (!integrated) {
      setError('Vyapar integration is not complete. Please integrate first.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getInventory();
      if (response && response.success) {
        setInventory(response.inventory || []);
      } else {
        setError(response.message || 'Failed to fetch inventory.');
        setInventory([]); // Clear inventory on error
      }
    } catch (err) {
      console.error('Fetch Inventory Error:', err);
      setError(err.message || 'An unexpected error occurred while fetching inventory.');
      setInventory([]); // Clear inventory on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refetch when the screen comes into focus
      fetchInventoryData();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, fetchInventoryData]);


  const onRefresh = () => {
    setRefreshing(true);
    fetchInventoryData();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name} ({item.id})</Text>
      <Text>Quantity: {item.quantity === null || item.quantity === undefined ? 'N/A (Service)' : item.quantity} {item.unit || ''}</Text>
      <Text>Price: {item.price ? `${item.price.toFixed(2)}` : 'N/A'}</Text>
      {item.category && <Text>Category: {item.category}</Text>}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Inventory...</Text>
      </View>
    );
  }

  if (error && !isIntegrated) {
    return (
        <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Go to Vyapar Integration" onPress={() => navigation.navigate('VyaparIntegration')} />
        </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchInventoryData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isIntegrated && (
          <View style={styles.warningContainer}>
              <Text style={styles.warningText}>Vyapar not integrated.</Text>
              <Button title="Integrate Vyapar" onPress={() => navigation.navigate('VyaparIntegration')} />
          </View>
      )}
      {isIntegrated && inventory.length === 0 && !loading && (
        <View style={styles.centered}>
            <Text>No inventory items found, or unable to fetch.</Text>
            <Text>Pull down to refresh or try again later.</Text>
        </View>
      )}
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={inventory.length === 0 ? styles.emptyList : {}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningContainer: {
    padding: 15,
    backgroundColor: '#fff3cd',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffeeba',
  },
  warningText: {
    color: '#856404',
    marginBottom: 10,
  }
});
