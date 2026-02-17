import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Location from 'expo-location'; // for getting device location
import { setLocation } from '../services/location.service';

export default function LocationScreen() {
  const [location, setLocationState] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocationState({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  const handleSendLocation = async () => {
    if (!location) return;
    try {
      const response = await setLocation({
        latitude: location.lat,
        longitude: location.lng,
      });
      Alert.alert('Success', 'Location sent!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Text>Latitude: {location?.lat}</Text>
      <Text>Longitude: {location?.lng}</Text>
      <Button title="Send Location" onPress={handleSendLocation} disabled={!location} />
    </View>
  );
}