// src/screens/HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getShelters } from '../services/shelterService';
import { deleteShelter } from '../services/shelterService';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [shelters, setShelters] = useState([]);
  const mapRef = useRef(null);

  // Fetch shelters from API and map coords
  useEffect(() => {
    getShelters()
      .then(response => {
        const data = response.data.map(s => ({
          id: s.id.toString(),
          name: s.name,
          capacity: s.capacity,
          coords: { latitude: s.latitude, longitude: s.longitude }
        }));
        setShelters(data);
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar abrigos.'));
  }, []);

  // Obtain user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão', 'Permissão de localização negada.');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      </View>
    );
  }

  const { latitude, longitude } = location;
  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015
  };

  const handleSelect = shelter => {
    setSelectedId(shelter.id);
    mapRef.current?.animateToRegion(
      {
        latitude: shelter.coords.latitude,
        longitude: shelter.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      1000
    );
  };

  const handleMapPress = () => {
    setSelectedId(null);
    mapRef.current?.animateToRegion(initialRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        onPress={handleMapPress}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Você está aqui"
        />
        {shelters.map(shelter => (
          <Marker
            key={shelter.id}
            coordinate={shelter.coords}
            title={shelter.name}
            description={`Capacidade: ${shelter.capacity}`}
            pinColor={shelter.id === selectedId ? 'blue' : 'red'}
          />
        ))}
      </MapView>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileIcon}>⚙️</Text>
          </TouchableOpacity>
          <Text style={styles.listTitle}>Abrigos Próximos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('ShelterForm')}
          >
            <Text style={styles.addIcon}>＋</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <ScrollView contentContainerStyle={styles.listContent}>
          {shelters.map(shelter => (
            <TouchableOpacity
              key={shelter.id}
              style={[
                styles.listItem,
                shelter.id === selectedId && styles.listItemSelected
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelect(shelter)}
            >
              <Text style={styles.itemName}>{shelter.name}</Text>
              <Text style={styles.itemCapacity}>
                Capacidade: {shelter.capacity}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('ShelterForm', { shelter })}
              >
                <Text style={styles.editText}>✎</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  map: { flex: 3 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 8, fontSize: 16, color: '#666' },
  listContainer: { flex: 2, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingVertical: 12, paddingHorizontal: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileIcon: { fontSize: 24, color: '#333' },
  listTitle: { fontSize: 20, fontWeight: '600', color: '#333' },
  addButton: { backgroundColor: '#007bff', borderRadius: 20, padding: 6 },
  addIcon: { color: '#fff', fontSize: 18 },
  separator: { height: 1, backgroundColor: '#ddd', marginVertical: 12 },
  listContent: { paddingBottom: 16 },
  listItem: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, position: 'relative' },
  listItemSelected: { backgroundColor: '#e0f7fa' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 4 },
  itemCapacity: { fontSize: 14, color: '#555' },
  editButton: { position: 'absolute', top: 8, right: 8, backgroundColor: '#ffc107', borderRadius: 12, padding: 4 },
  editText: { color: '#fff', fontSize: 12 }
});
