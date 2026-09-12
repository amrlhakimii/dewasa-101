import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

// Only ever rendered inside the authenticated dashboard (App.tsx gates on
// `user` before showing DashboardLayout at all), so `user` is always set here.
export function AuthButton() {
  const { user, signOutUser } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName ?? 'Account'}
          className="h-7 w-7 rounded-full"
          referrerPolicy="no-referrer"
        />
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
