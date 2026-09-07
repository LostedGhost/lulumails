import React, { useState, useEffect } from 'react';
import { FileCode, Plus, Eye } from 'lucide-react';

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  subject: string;
  bodyHtml: string;
  variables: string[];
}

export const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('<h1>Bonjour {{name}}</h1><p>Votre code est {{code}}</p>');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('http://localhost:4000/v1/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    // extract variables {{var}}
    const matches = bodyHtml.match(/{{\s*([a-zA-Z0-9_]+)\s*}}/g) || [];
    const variables = Array.from(new Set(matches.map(m => m.replace(/{{\s*|\s*}}/g, ''))));

    try {
      const res = await fetch('http://localhost:4000/v1/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          subject,
          bodyHtml,
          variables,
        }),
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setSubject('');
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
        Templates de Mails
      </h1>
      <p style={{ color: 'var(--c-muted)', marginBottom: 'var(--space-6)' }}>
        Créez et gérez des modèles HTML avec insertion dynamique de variables (ex: {"{{name}}, {{code}}"}).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        {/* Create Template Form */}
        <div className="card-glass">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Plus size={18} color="var(--c-brand)" />
            <span>Nouveau Template</span>
          </h2>

          <form onSubmit={handleCreateTemplate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Nom du modèle</label>
              <input type="text" className="input" placeholder="Mail de Bienvenue" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Identifiant Slug</label>
              <input type="text" className="input" placeholder="tpl_welcome" value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Sujet du mail</label>
              <input type="text" className="input" placeholder="Bienvenue {{name}} !" value={subject} onChange={e => setSubject(e.target.value)} required />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '4px', display: 'block' }}>Code HTML</label>
              <textarea
                className="input"
                style={{ height: '140px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
                value={bodyHtml}
                onChange={e => setBodyHtml(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Enregistrer le Template
            </button>
          </form>
        </div>

        {/* Templates List & Preview */}
        <div>
          <div className="card-glass" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              Templates Enregistrés ({templates.length})
            </h2>

            {templates.length === 0 ? (
              <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)' }}>Aucun template créé.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {templates.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--c-line)',
                      background: selectedTemplate?.id === t.id ? 'var(--c-brand-soft)' : 'var(--c-surface-sunken)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>{t.slug}</div>
                    </div>
                    <Eye size={16} color="var(--c-brand)" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedTemplate && (
            <div className="card-glass">
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--c-brand-strong)', marginBottom: 'var(--space-2)' }}>
                Aperçu de "{selectedTemplate.name}"
              </h3>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--c-muted)', marginBottom: 'var(--space-3)' }}>
                Sujet: {selectedTemplate.subject}
              </div>
              <div
                style={{
                  border: '1px solid var(--c-line)',
                  borderRadius: 'var(--radius)',
                  padding: '12px',
                  background: '#ffffff',
                  color: '#000000',
                  minHeight: '100px',
                }}
                dangerouslySetInnerHTML={{ __html: selectedTemplate.bodyHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
