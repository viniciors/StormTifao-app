// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
// Firebase compat auth import
import { auth } from '../firebase/config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }
    try {
      await auth.signInWithEmailAndPassword(email.trim(), password);
      navigation.replace('Home');
    } catch (err) {
      let message = '';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-login-credentials'
      ) {
        message = 'Usuário não encontrado ou senha incorreta';
      } else {
        message = err.message;
      }
      Alert.alert('Falha no login', message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo no topo */}
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotContainer}
      >
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          title="Entrar"
          onPress={handleLogin}
          color="#28a745"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastro"
          onPress={() => navigation.navigate('Register')}
          color="#007bff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 24
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  forgotContainer: {
    marginBottom: 20
  },
  forgotText: {
    color: '#0066cc',
    fontSize: 14
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12
  }
});
