import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { getPersistedState, useFinanceStore, type PersistedFinanceState } from '@/stores/useFinanceStore';

const SAVE_DEBOUNCE_MS = 800;

/** Keeps the finance store scoped to exactly the signed-in user's own
 * Firestore document — nothing else. Every real account change (sign in,
 * sign out, switching accounts) resets the store first, so a new session
 * can never briefly show a previous user's data before its own doc loads.
 *
 * Keyed on `user?.uid` rather than the `user` object itself: Firebase Auth
 * can re-emit a new `user` object for the *same* signed-in account (token
 * refresh, tab refocus, persistence rehydration) without an actual sign-in/
 * sign-out happening. Depending on the object reference made this effect
 * re-run mid-session, which called reset() and wiped out an edit that
 * hadn't been saved yet — hence "why does my input keep reverting".
 *
 * Returns `ready`: false until the initial Firestore fetch for this uid has
 * resolved, so callers (App.tsx) can hold the loading screen a beat longer
 * instead of briefly rendering default/stale data before the real doc loads. */
export function useFirestoreSync() {
  const { user } = useAuth();
  const uid = user?.uid;
  const hydrate = useFinanceStore((s) => s.hydrate);
  const reset = useFinanceStore((s) => s.reset);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [readyForUid, setReadyForUid] = useState<string | undefined>(undefined);
  const ready = readyForUid === uid;

  useEffect(() => {
    reset();
    if (!uid) return;

    let cancelled = false;
    let unsubscribeStore: (() => void) | undefined;
    const docRef = doc(db, 'users', uid);

    (async () => {
      const snapshot = await getDoc(docRef);
      if (cancelled) return;

      if (snapshot.exists()) {
        hydrate(snapshot.data() as PersistedFinanceState);
      }
      setReadyForUid(uid);

      unsubscribeStore = useFinanceStore.subscribe((state) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          setDoc(docRef, getPersistedState(state)).catch((error) => {
            console.error('Failed to save financial profile', error);
          });
        }, SAVE_DEBOUNCE_MS);
      });
    })();

    return () => {
      cancelled = true;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      unsubscribeStore?.();
    };
  }, [uid, hydrate, reset]);

  return { ready };
}
