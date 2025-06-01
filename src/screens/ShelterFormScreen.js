// src/screens/ShelterFormScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { auth } from '../firebase/config';
import { createShelter, updateShelter } from '../services/shelterService';

// Apenas estes e-mails podem acessar esta tela
const ADMIN_EMAILS = ['admin@seuapp.com'];

export default function ShelterFormScreen({ navigation, route }) {
  const shelterParam = route.params?.shelter || null;
  const isEdit = !!shelterParam;

  const [name, setName] = useState(isEdit ? shelterParam.name : '');
  const [capacity, setCapacity] = useState(
    isEdit ? String(shelterParam.capacity) : ''
  );
  const [address, setAddress] = useState(
    isEdit ? shelterParam.address : ''
  );
  const [coords, setCoords] = useState(
    isEdit ? shelterParam.coords : null
  );
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  // Verifica se usuário é admin
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      Alert.alert('Acesso negado', 'Você não tem permissão para acessar esta tela.');
      navigation.goBack();
    }
  }, []);

  // Atualiza coords ao tocar no mapa
  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    setCoords(coordinate);
    mapRef.current?.animateToRegion(
      {
        ...coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      500
    );
  };

  // Função disparada ao tocar em “Atualizar Abrigo” ou “Criar Abrigo”
  const handleSave = async () => {
    // Validação simples (nome agora é opcional)
    if (!capacity || !coords) {
      Alert.alert('Erro', 'Preencha capacidade e selecione no mapa.');
      return;
    }

    setLoading(true);

    // Monta payload
    const payload = {
      name: name.trim(),
      capacity: Number(capacity),
      address: address.trim(),
      latitude: coords.latitude,
      longitude: coords.longitude
    };

    try {
      if (isEdit) {
        const id = Number(shelterParam.id);
        // Caso o back-end exija o ID no corpo:
        payload.id = id;

        await updateShelter(id, payload);
        Alert.alert('Sucesso', 'Abrigo atualizado com sucesso.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Home');
            }
          }
        ]);
      } else {
        await createShelter(payload);
        Alert.alert('Sucesso', 'Abrigo criado com sucesso.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Home');
            }
          }
        ]);
      }
    } catch (err) {
      let mensagem = 'Falha ao salvar abrigo.';
      if (err.response) {
        mensagem += ` (status ${err.response.status})`;
      }
      Alert.alert('Erro', mensagem);
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
          {loading && (
            <ActivityIndicator
              size="large"
              color="#007bff"
              style={{ marginBottom: 16 }}
            />
          )}

          <Text style={styles.title}>
            {isEdit ? 'Editar Abrigo' : 'Novo Abrigo'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do abrigo (opcional)"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Endereço do abrigo"
            value={address}
            onChangeText={setAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="Capacidade"
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
          />

          <Text style={styles.mapLabel}>Toque no mapa para posicionar</Text>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: coords?.latitude || -23.5,
              longitude: coords?.longitude || -46.6,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            }}
            onPress={handleMapPress}
          >
            {coords && <Marker coordinate={coords} />}
          </MapView>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: isEdit ? '#ffc107' : '#28a745' }
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {isEdit ? 'Atualizar Abrigo' : 'Criar Abrigo'}
            </Text>
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
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  mapLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 16
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});