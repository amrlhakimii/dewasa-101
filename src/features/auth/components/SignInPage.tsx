import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo-source.png';
import { GoogleIcon } from '@/features/auth/components/GoogleIcon';
import { useAuth } from '@/lib/useAuth';

export function SignInPage() {
  const { signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      setError('Log masuk gagal — sila cuba lagi.');
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div
      className="app-bg flex min-h-svh flex-col items-center justify-center px-4 py-10"
      style={{
        paddingTop: 'max(2.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="w-full max-w-sm animate-fade-up rounded-2xl border border-white/5 bg-surface/90 p-8 text-center shadow-elevated backdrop-blur-sm">
        <img src={logo} alt="Dewasa 101" className="mx-auto h-20 w-20 rounded-2xl shadow-glow" />

        <h1 className="font-display mt-5 text-2xl font-extrabold tracking-tight">
          <span className="text-brand-300">Dewasa</span> <span className="text-text-h">101</span>
        </h1>
        <p className="mt-2 text-sm text-text">Semakan realiti kewangan untuk generasi muda Malaysia</p>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={signingIn}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-neutral-800 shadow-glow transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
        >
          <GoogleIcon />
          {signingIn ? 'Sedang log masuk…' : 'Teruskan dengan Google'}
        </button>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <div className="mt-6 flex items-start gap-2 rounded-xl bg-surface-muted px-3 py-2.5 text-left">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-300" />
          <p className="text-xs text-text">
            Gaji, hutang, dan maklumat zakat anda adalah sulit untuk akaun anda sahaja — tidak dikongsi, tidak
            bercampur dengan sesiapa.
          </p>
        </div>
      </div>
    </div>
  );
}
