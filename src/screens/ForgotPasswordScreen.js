// src/screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
// Firebase compat import
import { auth } from '../firebase/config';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu email.');
      return;
    }

    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Email enviado',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
      navigation.goBack();
    } catch (err) {
      let message = '';
      if (err.code === 'auth/user-not-found') {
        message = 'Email não cadastrado.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Formato de email inválido.';
      } else {
        message = err.message;
      }
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.instructions}>
            Informe seu email para receber o link de redefinição.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title={loading ? 'Enviando...' : 'Enviar Email'}
            onPress={handleReset}
            disabled={loading}
          />
          <View style={styles.backContainer}>
            <Button title="Voltar ao Login" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555'
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  backContainer: {
    marginTop: 16,
    alignItems: 'center'
  }
});
