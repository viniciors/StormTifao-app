// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Switch,
  ScrollView
} from 'react-native';
import { auth } from '../firebase/config';

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil & Configurações</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notificações</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View style={styles.section}>
        <Button title="Sair da Conta" onPress={handleLogout} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    color: '#333'
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555'
  }
});
