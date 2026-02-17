// app/admin/dashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { authEvents } from '../../utils/authEvents';
import { getBottomSpace, getStatusBarHeight } from '../../utils/safeArea';
import { getUsername, removeToken } from '../../utils/storage';

export default function AdminDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false); // ✅ This was missing

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await getUsername();
    if (user) setUsername(user);
  };

  // FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      console.log('Admin logout started');
      setLoading(true); // ✅ Now works because setLoading is defined
      
      // Remove token from storage
      await removeToken();
      console.log('Token removed successfully');
      
      // Notify layout about auth change
      authEvents.emit();
      console.log('Auth event emitted');
      
      // Small delay to ensure everything is cleaned up
      setTimeout(() => {
        console.log('Redirecting to login');
        setLoading(false); // Reset loading before navigation
        router.replace('/login');
      }, 100);
      
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
      setLoading(false);
    }
  };

  // Alternative with confirmation dialog
  const handleLogoutWithConfirm = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Logout',
          onPress: async () => {
            try {
              console.log('Admin logout started');
              setLoading(true);
              
              await removeToken();
              console.log('Token removed successfully');
              
              authEvents.emit();
              console.log('Auth event emitted');
              
              setTimeout(() => {
                console.log('Redirecting to login');
                setLoading(false);
                router.replace('/login');
              }, 100);
              
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const navigateToRegisterCustomer = () => {
    router.push('/admin/register-customer');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient colors={['#12141D', '#1E232E']} style={styles.gradient}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.username}>{username || 'Admin'} (Admin) 👋</Text>
            </View>
            <TouchableOpacity 
              onPress={handleLogout} // or handleLogoutWithConfirm
              style={styles.logoutButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#00E5FF" />
              ) : (
                <Ionicons name="log-out-outline" size={24} color="#00E5FF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={32} color="#00E5FF" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="person-add-outline" size={32} color="#00E5FF" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>New Today</Text>
            </View>
          </View>

          {/* Admin Actions */}
          <Text style={styles.sectionTitle}>Admin Actions</Text>

          {/* Register Customer Button */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={navigateToRegisterCustomer}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={['#1E232E', '#12141D']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="person-add" size={32} color="#00E5FF" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Register New Customer</Text>
                <Text style={styles.actionDescription}>
                  Create a new user account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#A0AAB5" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Coming Soon Card */}
          <TouchableOpacity
  style={styles.actionCard}
  onPress={() => router.push('/admin/customers')}
  activeOpacity={0.8}
  disabled={loading}
>
  <LinearGradient
    colors={['#1E232E', '#12141D']}
    style={styles.actionGradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.actionIcon}>
      <Ionicons name="people" size={32} color="#00E5FF" />
    </View>
    <View style={styles.actionContent}>
      <Text style={styles.actionTitle}>Manage Users</Text>
      <Text style={styles.actionDescription}>
        View all registered customers
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#A0AAB5" />
  </LinearGradient>
</TouchableOpacity>

          {/* Extra bottom padding */}
          <View style={{ height: getBottomSpace() }} />
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
    paddingHorizontal: 20,
    paddingTop: getStatusBarHeight() + 10,
    paddingBottom: getBottomSpace() + 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  greeting: {
    fontSize: 14,
    color: '#A0AAB5',
    fontFamily: 'Montserrat-Regular',
  },
  username: {
    fontSize: 20,
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1E232E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(160, 170, 181, 0.2)',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AAB5',
    fontFamily: 'Montserrat-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'Montserrat-Bold',
    paddingHorizontal: 5,
  },
  actionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#12141D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  actionDescription: {
    fontSize: 13,
    color: '#A0AAB5',
    fontFamily: 'Montserrat-Regular',
  },
});