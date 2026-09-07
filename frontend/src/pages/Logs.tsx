import React, { useState, useEffect } from 'react';
import { History, RefreshCw } from 'lucide-react';

interface LogItem {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  providerUsed: string;
  errorMessage: string | null;
  attemptedProviders: string[];
  sentAt: string;
}

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:4000/v1/emails/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
            Logs d'Envoi & Debugging
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)' }}>
            Historique complet des requêtes d'envoi et du comportement du basculement failover.
          </p>
        </div>
        <button onClick={fetchLogs} className="btn-secondary">
          <RefreshCw size={14} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Destinataire</th>
              <th>Sujet</th>
              <th>Statut</th>
              <th>Provider Utilisé</th>
              <th>Séquence Failover</th>
              <th>Date & Heure</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--c-muted)', padding: '24px' }}>
                  Aucun log d'envoi enregistré.
                </td>
              </tr>
            ) : (
              logs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.recipient}</td>
                  <td>{l.subject}</td>
                  <td>
                    <span className={`badge ${l.status === 'sent' ? 'badge-success' : 'badge-danger'}`}>
                      {l.status === 'sent' ? 'Succès' : 'Échec'}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--c-brand-strong)' }}>
                      {l.providerUsed}
                    </code>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--c-muted)' }}>
                    {l.attemptedProviders?.join(' → ') || 'N/A'}
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>
                    {new Date(l.sentAt).toLocaleString('fr-FR')}
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
