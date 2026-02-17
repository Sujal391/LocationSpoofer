// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { authEvents } from '../utils/authEvents';
import { getToken, getUserRole } from '../utils/storage';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const checkAuth = async () => {
    const token = await getToken();
    const role = await getUserRole();
    console.log('Auth Check - Token:', !!token, 'Role:', role);
    setIsAuthenticated(!!token);
    setUserRole(role);
  };

  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for auth changes (logout)
    const unsubscribe = authEvents.addListener(() => {
      console.log('Auth changed, rechecking...');
      checkAuth();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    console.log('Navigation - Auth:', isAuthenticated, 'Role:', userRole, 'Path:', segments);

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        console.log('Redirecting to login');
        // Use setTimeout to avoid navigation conflicts
        setTimeout(() => {
          router.replace('/login');
        }, 100);
      }
    } else {
      if (inAuthGroup) {
        if (userRole === 'admin') {
          console.log('Redirecting to admin dashboard');
          setTimeout(() => {
            router.replace('/admin/dashboard');
          }, 100);
        } else {
          console.log('Redirecting to user dashboard');
          setTimeout(() => {
            router.replace('/user/dashboard');
          }, 100);
        }
      }
    }
  }, [isAuthenticated, userRole, segments]);

  return <Slot />;
}