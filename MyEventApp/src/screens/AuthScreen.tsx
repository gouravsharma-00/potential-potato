// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuthStore } from '../state/authStore';
import { generateToken } from '../../backend/src/auth'; // Import for mock token generation

const MOCK_USER = {
  id: 'user-abc', // This would come from your backend login
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    // In a real app, you'd send these to your GraphQL backend for actual authentication
    if (email === 'test@example.com' && password === 'password') {
      const mockToken = generateToken(MOCK_USER.id); // Generate a mock token
      setToken(mockToken);
      setUser(MOCK_USER);
      Alert.alert('Success', 'Logged in!');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});