// app/admin/customers.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCustomers } from '../../services/customer.service';
import { Customer } from '../../types/customer.types'; // Import the Customer type
import { getBottomSpace } from '../../utils/safeArea';

export default function CustomersScreen() {
  const router = useRouter();
  // ✅ Fix: Properly type the customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Error', 'Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#4CAF50' : '#FFA000';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient colors={['#12141D', '#1E232E']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#00E5FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registered Customers</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{customers.length}</Text>
            <Text style={styles.statLabel}>Total Customers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {customers.filter(c => c.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {customers.filter(c => !c.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        {/* Customers List */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00E5FF" />
            <Text style={styles.loadingText}>Loading customers...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#00E5FF"
                colors={['#00E5FF']}
              />
            }
          >
            {customers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color="#2A2F3A" />
                <Text style={styles.emptyText}>No customers found</Text>
                <Text style={styles.emptySubText}>
                  Customers will appear here once they register
                </Text>
              </View>
            ) : (
              customers.map((customer) => (
                <View key={customer.id} style={styles.customerCard}>
                  <View style={styles.customerHeader}>
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>{customer.username}</Text>
                      <Text style={styles.customerId}>ID: {customer.id}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(customer.isActive) + '20' }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(customer.isActive) }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(customer.isActive) }
                      ]}>
                        {getStatusText(customer.isActive)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.customerFooter}>
                    <View style={styles.roleContainer}>
                      <Ionicons name="person-outline" size={16} color="#A0AAB5" />
                      <Text style={styles.roleText}>{customer.role}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => Alert.alert('Info', `View details for ${customer.username}`)}
                    >
                      <Text style={styles.actionButtonText}>View Details</Text>
                      <Ionicons name="chevron-forward" size={16} color="#00E5FF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            
            {/* Extra bottom padding */}
            <View style={{ height: getBottomSpace() }} />
          </ScrollView>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E232E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#1E232E',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    color: '#00E5FF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AAB5',
    fontFamily: 'Montserrat-Regular',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    color: '#A0AAB5',
    marginTop: 10,
    fontFamily: 'Montserrat-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    marginTop: 16,
  },
  emptySubText: {
    color: '#A0AAB5',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  customerCard: {
    backgroundColor: '#1E232E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  customerId: {
    fontSize: 12,
    color: '#A0AAB5',
    fontFamily: 'Montserrat-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  customerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 170, 181, 0.1)',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    color: '#A0AAB5',
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#00E5FF',
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    marginRight: 4,
  },
});