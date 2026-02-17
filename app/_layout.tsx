// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { authEvents } from '../utils/authEvents';
import { getStatusBarHeight } from '../utils/safeArea';
import { getToken, getUserRole } from '../utils/storage';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'customer' | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const checkAuth = async () => {
    const token = await getToken();
    const role = await getUserRole();
    console.log('Layout - Auth Check:', { 
      hasToken: !!token, 
      role,
      currentPath: segments.join('/')
    });
    setIsAuthenticated(!!token);
    setUserRole(role);
  };

  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for auth changes
    const unsubscribe = authEvents.addListener(() => {
      console.log('Layout - Auth change detected, rechecking...');
      checkAuth();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    console.log('Layout - Navigation Decision:', {
      isAuthenticated,
      userRole,
      inAuthGroup,
      path: segments.join('/')
    });

    if (!isAuthenticated) {
      // Not logged in
      if (!inAuthGroup && segments[0] !== 'login') {
        console.log('Layout - Redirecting to login');
        setTimeout(() => {
          router.replace('/login');
        }, 100);
      }
    } else {
      // Logged in
      if (inAuthGroup) {
        // On login/register but logged in - redirect to dashboard
        const destination = userRole === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
        console.log('Layout - Redirecting to', destination);
        setTimeout(() => {
          router.replace(destination);
        }, 100);
      }
    }
  }, [isAuthenticated, userRole, segments]);

  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12141D',
    paddingTop: getStatusBarHeight(),
  },
});