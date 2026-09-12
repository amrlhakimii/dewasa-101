import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, googleProvider, logEvent } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider);
    logEvent('login', { method: 'google' });
  }

  async function signOutUser() {
    await signOut(auth);
    logEvent('logout');
  }

  return { user, loading, signInWithGoogle, signOutUser };
}
