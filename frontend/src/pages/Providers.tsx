import React, { useState, useEffect } from 'react';
import { Server, Plus, ShieldCheck } from 'lucide-react';

interface ProviderItem {
  id: string;
  providerType: string;
  name: string;
  dailyLimit: number;
  currentDailyUsage: number;
  priority: number;
  isActive: boolean;
}

export const Providers: React.FC = () => {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [providerType, setProviderType] = useState('resend');
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [dailyLimit, setDailyLimit] = useState(300);
  const [priority, setPriority] = useState(1);

  const fetchProviders = async () => {
    try {
      const res = await fetch('http://localhost:4000/v1/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers);
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    let config: Record<string, any> = {};
    if (['resend', 'brevo', 'mailersend'].includes(providerType)) {
      config = { apiKey };
    } else {
      config = { host: smtpHost, port: Number(smtpPort), user: smtpUser, pass: smtpPass };
    }

    try {
      const res = await fetch('http://localhost:4000/v1/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerType,
          name,
          config,
          dailyLimit: Number(dailyLimit),
          priority: Number(priority),
        }),
      });

      if (res.ok) {
        setName('');
        setApiKey('');
        setSmtpHost('');
        setSmtpUser('');
        setSmtpPass('');
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
        Fournisseurs & BYOK (Bring Your Own Key)
      </h1>
      <p style={{ color: 'var(--c-muted)', marginBottom: 'var(--space-6)' }}>
        Configurez vos clés gratuites (Resend, Brevo, Mailersend, SMTP) avec gestion des quotas et priorité de failover.
      </p>

      {/* Form Card */}
      <div className="card-glass" style={{ marginBottom: 'var(--space-6)', maxWidth: '700px' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Plus size={18} color="var(--c-brand)" />
          <span>Ajouter un Fournisseur d'Envoi</span>
        </h2>

        <form onSubmit={handleAddProvider} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Type</label>
              <select className="input" value={providerType} onChange={e => setProviderType(e.target.value)}>
                <option value="resend">Resend API (100 mails/jour gratuit)</option>
                <option value="brevo">Brevo API (300 mails/jour gratuit)</option>
                <option value="mailersend">MailerSend API (3000 mails/mois)</option>
                <option value="gmail_smtp">Gmail SMTP (500 mails/jour)</option>
                <option value="custom_smtp">Custom SMTP Server</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Nom du Provider</label>
              <input type="text" className="input" placeholder="ex: Brevo Compte Perso" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>

          {['resend', 'brevo', 'mailersend'].includes(providerType) ? (
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Clé API</label>
              <input type="password" className="input" placeholder="re_123456789..." value={apiKey} onChange={e => setApiKey(e.target.value)} required />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 2fr', gap: 'var(--space-2)' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Hôte SMTP</label>
                <input type="text" className="input" placeholder="smtp.gmail.com" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Port</label>
                <input type="text" className="input" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Utilisateur</label>
                <input type="text" className="input" placeholder="user@gmail.com" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Mot de passe</label>
                <input type="password" className="input" placeholder="••••••••" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} required />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Limite Quotidienne Mails</label>
              <input type="number" className="input" value={dailyLimit} onChange={e => setDailyLimit(Number(e.target.value))} required />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Priorité (1 = Premier testé)</label>
              <input type="number" className="input" value={priority} onChange={e => setPriority(Number(e.target.value))} required />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 'var(--space-2)' }}>
            Enregistrer le Provider
          </button>
        </form>
      </div>

      {/* Providers Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Priorité Failover</th>
              <th>Utilisation Jour / Limite</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--c-muted)', padding: '24px' }}>
                  Aucun fournisseur configuré. Ajoutez une clé Resend, Brevo ou SMTP pour démarrer.
                </td>
              </tr>
            ) : (
              providers.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{p.providerType}</code></td>
                  <td># {p.priority}</td>
                  <td>{p.currentDailyUsage} / {p.dailyLimit} mails</td>
                  <td>
                    <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {p.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
