// app/user/dashboard.tsx - Updated for manual input
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { setLocation } from '../../services/location.service';
import { removeToken } from '../../utils/storage';

export default function UserDashboard() {
  const router = useRouter();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMock, setActiveMock] = useState(false);

  const handleSetLocation = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Please enter both coordinates');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Invalid coordinates');
      return;
    }

    if (lat < -90 || lat > 90) {
      Alert.alert('Error', 'Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      Alert.alert('Error', 'Longitude must be between -180 and 180');
      return;
    }

    setLoading(true);
    try {
      // Send to backend for logging/tracking
      await setLocation({ latitude: lat, longitude: lng });
      
      // Here you would also save to system mock location
      // This requires native module integration
      
      setActiveMock(true);
      Alert.alert(
        'Success', 
        `Mock location set to:\nLat: ${lat}\nLng: ${lng}\n\nNow select this app as mock location app in Developer Options.`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not set location');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeToken();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient colors={['#12141D', '#1E232E']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mock Location Control</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#00E5FF" />
            </TouchableOpacity>
          </View>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons 
                name={activeMock ? "checkmark-circle" : "alert-circle"} 
                size={24} 
                color={activeMock ? "#4CAF50" : "#FFA000"} 
              />
              <Text style={styles.statusTitle}>
                {activeMock ? "Mock Location Active" : "Mock Location Inactive"}
              </Text>
            </View>
            <Text style={styles.statusText}>
              {activeMock 
                ? "Your device is using the coordinates below as mock location"
                : "Set coordinates below and enable mock location in Developer Options"}
            </Text>
          </View>

          {/* Instructions Card */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>📱 How to Enable:</Text>
            <Text style={styles.instructionStep}>1. Enable Developer Options (tap Build Number 7 times in Settings)</Text>
            <Text style={styles.instructionStep}>2. Go to Developer Options</Text>
            <Text style={styles.instructionStep}>3. Select "Select mock location app"</Text>
            <Text style={styles.instructionStep}>4. Choose "MockLocationApp"</Text>
            <Text style={styles.instructionStep}>5. Return here and set your coordinates</Text>
          </View>

          {/* Input Card */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>LATITUDE</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="compass-outline" size={20} color="#00E5FF" />
              <TextInput
                style={styles.input}
                placeholder="e.g., 37.7749"
                placeholderTextColor="#4A4F5A"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>LONGITUDE</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="compass-outline" size={20} color="#00E5FF" />
              <TextInput
                style={styles.input}
                placeholder="e.g., -122.4194"
                placeholderTextColor="#4A4F5A"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.setButton}
              onPress={handleSetLocation}
              disabled={loading}
            >
              <LinearGradient
                colors={['#00C6FF', '#0072FF']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>SET MOCK LOCATION</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Presets (Optional) */}
          <Text style={styles.presetTitle}>Quick Presets</Text>
          <View style={styles.presetContainer}>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                setLatitude('40.7128');
                setLongitude('-74.0060');
              }}
            >
              <Text style={styles.presetText}>🗽 New York</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                setLatitude('51.5074');
                setLongitude('-0.1278');
              }}
            >
              <Text style={styles.presetText}>🇬🇧 London</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                setLatitude('35.6762');
                setLongitude('139.6503');
              }}
            >
              <Text style={styles.presetText}>🗼 Tokyo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12141D',
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E232E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  statusCard: {
    backgroundColor: '#1E232E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Montserrat-SemiBold',
  },
  statusText: {
    fontSize: 14,
    color: '#A0AAB5',
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: '#1E232E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  instructionsTitle: {
    fontSize: 16,
    color: '#00E5FF',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  instructionStep: {
    fontSize: 13,
    color: '#A0AAB5',
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 18,
  },
  inputCard: {
    backgroundColor: '#1E232E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  inputLabel: {
    fontSize: 12,
    color: '#00E5FF',
    marginBottom: 8,
    fontFamily: 'Montserrat-Medium',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141D',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(160, 170, 181, 0.2)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
  },
  setButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  presetTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#1E232E',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  presetText: {
    color: '#A0AAB5',
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
  },
});