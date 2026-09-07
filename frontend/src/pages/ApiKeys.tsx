import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  status: string;
  createdAt: string;
}

export const ApiKeys: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('http://localhost:4000/v1/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys);
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    try {
      const res = await fetch('http://localhost:4000/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.apiKey);
        setNewKeyName('');
        fetchKeys();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/v1/keys/${id}`, { method: 'DELETE' });
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
        Clés API Client
      </h1>
      <p style={{ color: 'var(--c-muted)', marginBottom: 'var(--space-6)' }}>
        Générez des clés API sécurisées (`lm_live_...`) pour vos applications web et mobiles.
      </p>

      {/* Create Key Card */}
      <div className="card-glass" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Plus size={18} color="var(--c-brand)" />
          <span>Créer une nouvelle clé API</span>
        </h2>
        <form onSubmit={handleCreateKey} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="text"
            placeholder="Nom de l'application (ex: App Mobile iOS)"
            className="input"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Générer
          </button>
        </form>

        {generatedKey && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: '14px',
            borderRadius: 'var(--radius)',
            background: 'var(--c-ok-bg)',
            border: '1px solid var(--c-ok)',
          }}>
            <div style={{ color: 'var(--c-ok)', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: '6px' }}>
              ⚠️ Copiez cette clé maintenant ! Elle ne sera plus affichée par la suite.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <code style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--c-ink)',
                flex: 1,
              }}>
                {generatedKey}
              </code>
              <button
                onClick={() => copyToClipboard(generatedKey)}
                className="btn-secondary"
                style={{ padding: '6px 12px' }}
              >
                {copied ? <Check size={14} color="var(--c-ok)" /> : <Copy size={14} />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keys Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prefixe Clé</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--c-muted)', padding: '24px' }}>
                  Aucune clé API créée.
                </td>
              </tr>
            ) : (
              keys.map(k => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 600 }}>{k.name}</td>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{k.keyPrefix}...</code>
                  </td>
                  <td>
                    <span className={`badge ${k.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {k.status}
                    </span>
                  </td>
                  <td>{new Date(k.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {k.status === 'active' && (
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', color: 'var(--c-danger)', borderColor: 'var(--c-danger)' }}
                      >
                        <Trash2 size={14} />
                        <span>Révoker</span>
                      </button>
                    )}
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
