import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { getPersistedState, useFinanceStore, type PersistedFinanceState } from '@/stores/useFinanceStore';

const SAVE_DEBOUNCE_MS = 800;

/** Keeps the finance store scoped to exactly the signed-in user's own
 * Firestore document — nothing else. Every auth change (sign in, sign out,
 * switching accounts) resets the store first, so a new session can never
 * briefly show a previous user's data before its own doc loads. */
export function useFirestoreSync() {
  const { user } = useAuth();
  const hydrate = useFinanceStore((s) => s.hydrate);
  const reset = useFinanceStore((s) => s.reset);

  useEffect(() => {
    reset();
    if (!user) return;

    let cancelled = false;
    let unsubscribeStore: (() => void) | undefined;
    const docRef = doc(db, 'users', user.uid);

    (async () => {
      const snapshot = await getDoc(docRef);
      if (cancelled) return;

      if (snapshot.exists()) {
        hydrate(snapshot.data() as PersistedFinanceState);
      }

      let saveTimer: ReturnType<typeof setTimeout> | undefined;
      unsubscribeStore = useFinanceStore.subscribe((state) => {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          setDoc(docRef, getPersistedState(state)).catch((error) => {
            console.error('Failed to save financial profile', error);
          });
        }, SAVE_DEBOUNCE_MS);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribeStore?.();
    };
  }, [user, hydrate, reset]);
}
