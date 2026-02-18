import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Button, NativeModules, StyleSheet, Text, TextInput, View } from 'react-native';
import { setLocation } from '../services/location.service';

const { MockLocationModule } = NativeModules;

export default function LocationScreen() {
  const [location, setLocationState] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Get current device location on load
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocationState({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    })();
  }, []);

  // Inject manual mock location
  const handleSetMockLocation = async () => {
    if (!manualLat || !manualLng) {
      Alert.alert('Enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Invalid coordinates');
      return;
    }

    try {
      MockLocationModule.setMockLocation(lat, lng);

      Alert.alert('Mock Location Set');

      // Re-fetch updated location after injection
      setTimeout(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        setLocationState({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      }, 1000);

    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Send current location to backend
  const handleSendLocation = async () => {
    if (!location) return;

    try {
      await setLocation({
        latitude: location.lat,
        longitude: location.lng,
      });

      Alert.alert('Success', 'Location sent!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Device Location:</Text>
      <Text>Latitude: {location?.lat}</Text>
      <Text>Longitude: {location?.lng}</Text>

      <Text style={styles.label}>Enter Latitude:</Text>
      <TextInput
        placeholder="e.g. 22.5726"
        value={manualLat}
        onChangeText={setManualLat}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Enter Longitude:</Text>
      <TextInput
        placeholder="e.g. 88.3639"
        value={manualLng}
        onChangeText={setManualLng}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        title="Set Mock Location"
        onPress={handleSetMockLocation}
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Send Location"
          onPress={handleSendLocation}
          disabled={!location}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});
