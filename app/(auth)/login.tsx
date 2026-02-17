// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { login } from '../../services/auth.service';
import { saveUsername, saveUserRole } from '../../utils/storage';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      // Login to get token
      await login({ username, password });
      
      // Save username for display
      await saveUsername(username);
      
      // TEMPORARY: For now, determine role based on username
      // When backend is ready, this will come from token/API
      if (username.toLowerCase().includes('admin')) {
        await saveUserRole('admin');
        router.replace('/admin/dashboard');
      } else {
        await saveUserRole('user');
        router.replace('/user/dashboard');
      }
      
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.background}>
            <View style={styles.content}>
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name="location" size={48} color="#00E5FF" />
                </View>
                <Text style={styles.appName}>MockLocationApp</Text>
                <Text style={styles.tagline}>Share your location securely</Text>
              </View>

              {/* Login Card */}
              <View style={styles.card}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subText}>Sign in to your account</Text>

                {/* Username Field */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>USERNAME</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={18} color="#A0AAB5" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your username"
                      placeholderTextColor="#A0AAB5"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={18} color="#A0AAB5" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="#A0AAB5"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons 
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                        size={18} 
                        color="#A0AAB5" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotContainer}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#00C6FF', '#0072FF']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>SIGN IN</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign Up Link - Will be shown to everyone for now */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.footerLink}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12141D',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#12141D',
    minHeight: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E232E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#A0AAB5',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#1E232E',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  welcomeText: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 15,
    color: '#A0AAB5',
    marginBottom: 32,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 170, 181, 0.2)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#12141D',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotText: {
    fontSize: 13,
    color: '#00E5FF',
    letterSpacing: 0.5,
  },
  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0072FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#A0AAB5',
    letterSpacing: 0.3,
  },
  footerLink: {
    fontSize: 14,
    color: '#00E5FF',
    letterSpacing: 0.5,
  },
});