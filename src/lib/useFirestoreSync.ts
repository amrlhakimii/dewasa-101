import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { getPersistedState, useFinanceStore, type PersistedFinanceState } from '@/stores/useFinanceStore';

const SAVE_DEBOUNCE_MS = 800;

/** Loads a signed-in user's saved financial profile once, then keeps
 * Firestore in sync with every subsequent local change (debounced).
 * Signed-out users get no persistence — local state only, lost on refresh. */
export function useFirestoreSync() {
  const { user } = useAuth();
  const hydrate = useFinanceStore((s) => s.hydrate);

  useEffect(() => {
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
  }, [user, hydrate]);
}
