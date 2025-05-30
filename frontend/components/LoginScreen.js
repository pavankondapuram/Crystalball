import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { requestOtp, verifyOtp } from '../services/api'; // Assuming api.js will be updated

export default function LoginScreen({ onLoginSuccess }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!mobileNumber.trim() || !/^\d{10,15}$/.test(mobileNumber.trim())) {
      Alert.alert('Error', 'Please enter a valid mobile number (10-15 digits).');
      return;
    }
    setLoading(true);
    try {
      // In a real app, the backend would send an OTP via SMS
      const response = await requestOtp(mobileNumber.trim()); 
      console.log('Request OTP Response:', response); // For debugging
      if (response && response.success) { // Assuming backend returns { success: true, message: 'OTP sent' }
        setOtpRequested(true);
        Alert.alert('Success', response.message || 'OTP has been sent to your mobile number.');
      } else {
        Alert.alert('Error', response.message || 'Failed to request OTP. Please try again.');
      }
    } catch (error) {
      console.error('Request OTP Error:', error);
      Alert.alert('Error', error.message || 'An error occurred while requesting OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || !/^\d{4,6}$/.test(otp.trim())) {
      Alert.alert('Error', 'Please enter a valid OTP (usually 4-6 digits).');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(mobileNumber.trim(), otp.trim());
      console.log('Verify OTP Response:', response); // For debugging
      if (response && response.success) { // Assuming backend returns { success: true, token: 'xyz' }
        Alert.alert('Success', 'Login successful!');
        if (onLoginSuccess) {
          onLoginSuccess(response.token); // Pass token or user data up
        }
      } else {
        Alert.alert('Error', response.message || 'Invalid OTP or verification failed.');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('Error', error.message || 'An error occurred during OTP verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile OTP Login</Text>
      
      {!otpRequested ? (
        <>
          <Text style={styles.label}>Enter Mobile Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1234567890"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            editable={!loading}
          />
          <Button
            title={loading ? "Sending OTP..." : "Request OTP"}
            onPress={handleRequestOtp}
            disabled={loading}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter OTP:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP received"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            editable={!loading}
          />
          <Button
            title={loading ? "Verifying..." : "Verify OTP & Login"}
            onPress={handleVerifyOtp}
            disabled={loading}
          />
          <Button
            title="Change Mobile Number"
            onPress={() => {
              setOtpRequested(false);
              setOtp('');
              // setMobileNumber(''); // Optionally clear mobile number too
            }}
            disabled={loading}
            color="#777" // A different color for secondary action
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    borderRadius: 5,
  },
});
