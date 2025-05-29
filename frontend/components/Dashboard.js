import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ForecastView from './ForecastView';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
      <ForecastView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Add styles here
  },
});
