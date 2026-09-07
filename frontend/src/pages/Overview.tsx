import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const Overview: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmails: 0,
    sentCount: 0,
    failedCount: 0,
    successRate: 100,
    activeProvidersCount: 0,
  });

  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:4000/v1/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // offline/fallback
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setSending(true);
    setResultMsg(null);

    try {
      const res = await fetch('http://localhost:4000/v1/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          subject: 'Test d\'envoi LuluMails',
          html: '<h1>Bienvenue sur LuluMails</h1><p>Ceci est un mail de test envoyé avec succès via le moteur multi-providers.</p>',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResultMsg(`Email envoyé avec succès via ${data.provider} (ID: ${data.id})`);
        fetchStats();
      } else {
        setResultMsg(`Erreur (${res.status}): ${data.error || 'Échec de l\'envoi'}`);
      }
    } catch (err: any) {
      setResultMsg(`Erreur réseau: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
        Vue d'ensemble LuluMails
      </h1>
      <p style={{ color: 'var(--c-muted)', marginBottom: 'var(--space-6)' }}>
        Statistiques en temps réel du moteur d'envoi et de failover multi-fournisseurs.
      </p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card-glass">
          <div style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            Mails Envoyés (Total)
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--c-ink)' }}>
            {stats.totalEmails}
          </div>
        </div>

        <div className="card-glass">
          <div style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            Taux de Délivrabilité
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--c-ok)' }}>
            {stats.successRate}%
          </div>
        </div>

        <div className="card-glass">
          <div style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            Providers Actifs (Pool)
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--c-brand)' }}>
            {stats.activeProvidersCount}
          </div>
        </div>
      </div>

      {/* Quick Test Email Card */}
      <div className="card-glass" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Zap size={20} color="var(--c-brand)" />
          <span>Tester un envoi instantané</span>
        </h2>
        <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
          Envoyez un mail de test pour valider la chaîne de failover de vos providers enregistrés.
        </p>

        <form onSubmit={handleSendTest} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="email"
            placeholder="destinataire@domaine.com"
            className="input"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={sending}>
            <Send size={16} />
            <span>{sending ? 'Envoi...' : 'Envoyer'}</span>
          </button>
        </form>

        {resultMsg && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: '12px',
            borderRadius: 'var(--radius)',
            background: resultMsg.startsWith('Email envoyé') ? 'var(--c-ok-bg)' : 'var(--c-danger-bg)',
            color: resultMsg.startsWith('Email envoyé') ? 'var(--c-ok)' : 'var(--c-danger)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
          }}>
            {resultMsg}
          </div>
        )}
      </div>
    </div>
  );
};
