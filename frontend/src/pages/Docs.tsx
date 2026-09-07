import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, Code2, ExternalLink } from 'lucide-react';

export const Docs: React.FC = () => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const copyCode = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const snippets = {
    sdk: `// 1. Installation du SDK
// npm install @lulumails/sdk

import { LuluMails } from '@lulumails/sdk';

const lulu = new LuluMails({
  apiKey: 'lm_live_votre_cle_api_ici',
  baseUrl: 'http://localhost:4000'
});

// 2. Envoi d'un email avec failover automatique
async function sendMail() {
  const res = await lulu.emails.send({
    to: 'destinataire@exemple.com',
    subject: 'Bienvenue sur notre application',
    html: '<h1>Bonjour {{name}}</h1><p>Votre compte est actif !</p>',
    variables: { name: 'Thomas' }
  });

  console.log('Mail envoyé avec succès ! ID:', res.id, 'Provider:', res.provider);
}`,
    curl: `curl -X POST http://localhost:4000/v1/emails/send \\
  -H "Authorization: Bearer lm_live_votre_cle_api_ici" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "destinataire@exemple.com",
    "subject": "Confirmation de commande",
    "html": "<p>Merci pour votre commande #1234</p>"
  }'`,
    python: `import requests

url = "http://localhost:4000/v1/emails/send"
headers = {
    "Authorization": "Bearer lm_live_votre_cle_api_ici",
    "Content-Type": "application/json"
}
payload = {
    "to": "destinataire@exemple.com",
    "subject": "Code de vérification",
    "html": "Votre code est: 482910"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    php: `<?php
$ch = curl_init("http://localhost:4000/v1/emails/send");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lm_live_votre_cle_api_ici",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "to" => "destinataire@exemple.com",
    "subject" => "Notification PHP",
    "html" => "<p>Message envoyé via LuluMails</p>"
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
            Documentation d'Intégration Développeurs
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)' }}>
            Guides d'intégration pas à pas pour connecter LuluMails à vos applications.
          </p>
        </div>
        <a
          href="http://localhost:4000/docs"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: 'none' }}
        >
          <span>Swagger OpenAPI</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Snippet 1: Node.js / TS SDK */}
      <div className="card-glass" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Code2 size={18} color="var(--c-brand)" />
            <span>Intégration Node.js / TypeScript (SDK Officiel)</span>
          </h2>
          <button onClick={() => copyCode(snippets.sdk, 'sdk')} className="btn-secondary" style={{ padding: '4px 10px' }}>
            {copiedLang === 'sdk' ? <Check size={14} color="var(--c-ok)" /> : <Copy size={14} />}
            <span>{copiedLang === 'sdk' ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
        <pre style={{
          background: 'var(--c-surface-sunken)',
          padding: '16px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--c-line)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--c-ink)',
          overflowX: 'auto',
        }}>
          {snippets.sdk}
        </pre>
      </div>

      {/* Snippet 2: cURL / HTTP REST */}
      <div className="card-glass" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Terminal size={18} color="var(--c-brand)" />
            <span>Intégration HTTP / cURL API REST</span>
          </h2>
          <button onClick={() => copyCode(snippets.curl, 'curl')} className="btn-secondary" style={{ padding: '4px 10px' }}>
            {copiedLang === 'curl' ? <Check size={14} color="var(--c-ok)" /> : <Copy size={14} />}
            <span>{copiedLang === 'curl' ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
        <pre style={{
          background: 'var(--c-surface-sunken)',
          padding: '16px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--c-line)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--c-ink)',
          overflowX: 'auto',
        }}>
          {snippets.curl}
        </pre>
      </div>

      {/* Snippet 3 & 4: Python & PHP */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Python (Requests)</h3>
            <button onClick={() => copyCode(snippets.python, 'python')} className="btn-secondary" style={{ padding: '4px 10px' }}>
              {copiedLang === 'python' ? <Check size={14} color="var(--c-ok)" /> : <Copy size={14} />}
              <span>{copiedLang === 'python' ? 'Copié' : 'Copier'}</span>
            </button>
          </div>
          <pre style={{
            background: 'var(--c-surface-sunken)',
            padding: '12px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--c-line)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--c-ink)',
            overflowX: 'auto',
          }}>
            {snippets.python}
          </pre>
        </div>

        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>PHP (cURL)</h3>
            <button onClick={() => copyCode(snippets.php, 'php')} className="btn-secondary" style={{ padding: '4px 10px' }}>
              {copiedLang === 'php' ? <Check size={14} color="var(--c-ok)" /> : <Copy size={14} />}
              <span>{copiedLang === 'php' ? 'Copié' : 'Copier'}</span>
            </button>
          </div>
          <pre style={{
            background: 'var(--c-surface-sunken)',
            padding: '12px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--c-line)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--c-ink)',
            overflowX: 'auto',
          }}>
            {snippets.php}
          </pre>
        </div>
      </div>
    </div>
  );
};
