import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <Button variant="secondary" size="sm" onClick={() => signInWithGoogle()}>
        Sign in with Google
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user.photoURL && (
        <img src={user.photoURL} alt={user.displayName ?? 'Account'} className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
      )}
      <span className="hidden text-sm font-medium text-text-h sm:inline">{user.displayName?.split(' ')[0]}</span>
      <button
        type="button"
        onClick={() => signOutUser()}
        aria-label="Sign out"
        className="flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-surface-muted hover:text-danger"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
