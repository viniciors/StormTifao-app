// src/screens/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';
// Firebase compat import
import { auth } from '../firebase/config';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');
  const [number, setNumber] = useState('');
  const [birthDateText, setBirthDateText] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Buscar endereço via CEP
  useEffect(() => {
    const fetchAddress = async () => {
      if (cep.length === 8) {
        try {
          const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
          if (!res.data.erro) {
            setStreet(res.data.logradouro);
            setCity(res.data.localidade);
            setStateUf(res.data.uf);
          }
        } catch (err) {
          console.warn('Erro ao buscar CEP:', err);
        }
      }
    };
    fetchAddress();
  }, [cep]);

  // Validação dd/mm/aaaa
  const validateBirthDate = (text) => {
    const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(text);
  };

  // Formata entrada de data com barras automáticas
  const handleBirthDateChange = (text) => {
    // Remove todos que não são dígitos
    const digits = text.replace(/[^0-9]/g, '');
    let formatted = digits;
    if (digits.length > 2 && digits.length <= 4) {
      formatted = digits.slice(0,2) + '/' + digits.slice(2);
    } else if (digits.length > 4) {
      formatted = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4,8);
    }
    setBirthDateText(formatted);
    if (formatted.length === 10) {
      if (!validateBirthDate(formatted)) {
        setBirthDateError('Data inválida. Use dd/mm/aaaa');
      } else {
        setBirthDateError('');
      }
    } else {
      setBirthDateError('');
    }
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    // Verifica data
    if (!validateBirthDate(birthDateText)) {
      setBirthDateError('Data inválida. Use dd/mm/aaaa');
      return;
    }
    // Autenticação no Firebase
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Preencha email e senha para continuar.');
      return;
    }
    try {
      // Cria usuário no Firebase Auth (compat)
      await auth.createUserWithEmailAndPassword(email.trim(), password);
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso.');
      navigation.replace('Login');
    } catch (err) {
      let message = '';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Este email já está em uso.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Email inválido.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Senha muito fraca (mínimo 6 caracteres).';
      } else {
        message = err.message;
      }
      Alert.alert('Erro ao cadastrar', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Cadastro</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="CEP (8 dígitos)"
            keyboardType="number-pad"
            value={cep}
            onChangeText={text => setCep(text.replace(/[^0-9]/g, ''))}
            maxLength={8}
          />

          <TextInput
            style={[styles.input, styles.readonly]}
            placeholder="Rua"
            value={street}
            editable={false}
          />

          <TextInput
            style={[styles.input, styles.readonly]}
            placeholder="Cidade"
            value={city}
            editable={false}
          />

          <TextInput
            style={[styles.input, styles.readonly]}
            placeholder="UF"
            value={stateUf}
            editable={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Número"
            keyboardType="number-pad"
            value={number}
            onChangeText={setNumber}
          />

          <TextInput
            style={[styles.input, birthDateError && styles.inputError]}
            placeholder="Data de nascimento (dd/mm/aaaa)"
            value={birthDateText}
            onChangeText={handleBirthDateChange}
            maxLength={10}
            keyboardType="numeric"
          />
          {birthDateError ? (
            <Text style={styles.errorText}>{birthDateError}</Text>
          ) : null}

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

          <Button title="Cadastrar" onPress={handleRegister} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.linkText}>Voltar ao Login</Text>
          </TouchableOpacity>
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
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 24
  },
  input: {
    height: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  readonly: {
    backgroundColor: '#f2f2f2'
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginBottom: 16
  },
  backLink: {
    marginTop: 16,
    alignItems: 'center'
  },
  linkText: {
    color: '#0066cc'
  }
});
