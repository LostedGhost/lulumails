import React, { useState } from 'react';
import { X, Send, Lock, Mail, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; name: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/v1/auth/login' : '/v1/auth/register';
    const payload = mode === 'login' ? { email, password } : { email, password, name };

    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Une erreur est survenue');
      }
    } catch (err: any) {
      setErrorMsg('Erreur de connexion au serveur API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="card-glass" style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-6)', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--c-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <Send size={24} color="var(--c-brand)" />
            <span style={{ fontFamily: 'var(--font-brand)', fontSize: '1.8rem' }}>LuluMails</span>
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
            {mode === 'login' ? 'Connexion à votre compte' : 'Créer un compte gratuit'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Nom complet</label>
              <input type="text" className="input" placeholder="Thomas Dupont" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Adresse Email</label>
            <input type="email" className="input" placeholder="développeur@entreprise.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Mot de passe</label>
            <input type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {errorMsg && (
            <div style={{ padding: '8px 12px', borderRadius: 'var(--radius)', background: 'var(--c-danger-bg)', color: 'var(--c-danger)', fontSize: 'var(--text-xs)' }}>
              {errorMsg}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }} disabled={loading}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--c-muted)' }}>
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--c-brand)', fontWeight: 600, cursor: 'pointer' }}>
                S'inscrire gratuitement
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--c-brand)', fontWeight: 600, cursor: 'pointer' }}>
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
