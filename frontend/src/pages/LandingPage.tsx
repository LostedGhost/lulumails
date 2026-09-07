import React, { useState } from 'react';
import { Send, Zap, ShieldCheck, Server, Code2, ArrowRight, CheckCircle2, DollarSign, ChevronDown, ChevronUp, Sparkles, Layers, Users, Globe } from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onGoToDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDashboard, onOpenAuth, onGoToDocs }) => {
  const [monthlyVolume, setMonthlyVolume] = useState(25000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // SendGrid cost estimation vs LuluMails
  const sendgridCost = Math.round((monthlyVolume / 10000) * 15 + 20);
  const lulumailsCost = 0;

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Comment LuluMails permet-il d'envoyer des emails à 0€ ?",
      a: "LuluMails agrège les tranches gratuites (Free Tiers) des grands fournisseurs d'emails (Resend, Brevo, MailerSend, Gmail SMTP). Le moteur bascule automatiquement d'un fournisseur à l'autre lorsque le quota quotidien est atteint."
    },
    {
      q: "Mes emails risquent-ils de tomber en spam ?",
      a: "Non ! En utilisant vos propres clés d'API (Resend, Brevo, SMTP), vos emails bénéficient de la réputation de délivrabilité exceptionnelle des meilleurs routeurs du marché."
    },
    {
      q: "Quelle est la différence entre le plan Gratuit et le plan Pro ?",
      a: "Le plan Gratuit vous donne accès à 100% de la puissance du moteur d'envoi et jusqu'à 10 000 emails/mois. Le plan Pro offre des domaines d'expéditeur personnalisés (DKIM/SPF), un basculement prioritaire 99.99% SLA et un support prioritaire."
    },
    {
      q: "Puis-je intégrer LuluMails dans mon application mobile ou SaaS ?",
      a: "Oui ! Nous fournissons un SDK TypeScript/JavaScript officiel (`@lulumails/sdk`) ainsi qu'une API REST compatible avec cURL, Python, PHP, Go et Java."
    }
  ];

  return (
    <div style={{ background: 'var(--c-canvas)', color: 'var(--c-ink)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        padding: 'var(--space-8) var(--space-6)',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--c-brand-soft)',
          color: 'var(--c-brand-strong)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          marginBottom: 'var(--space-5)',
        }}>
          <Sparkles size={14} />
          <span>La 1ère Plateforme d'API Email Commerciale 100% Gratuite</span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-1px',
          marginBottom: 'var(--space-4)',
        }}>
          Envoyez des millions d'emails <br />
          <span style={{ color: 'var(--c-brand)' }}>sans débourser un seul centime</span>
        </h1>

        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--c-muted)',
          maxWidth: '750px',
          margin: '0 auto var(--space-6)',
          lineHeight: 1.6,
        }}>
          LuluMails agrège intelligemment les quotas gratuits des meilleurs routeurs (Resend, Brevo, MailerSend, SMTP) avec basculement automatique. Dites adieu aux factures SendGrid à 200$/mois.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
          <button onClick={() => onOpenAuth('register')} className="btn-primary" style={{ padding: '14px 28px', fontSize: 'var(--text-base)' }}>
            <span>Démarrer gratuitement</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={onGoToDashboard} className="btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--text-base)' }}>
            <span>Accéder au Dashboard App</span>
          </button>
        </div>

        {/* Live Interactive Code Preview */}
        <div className="card-glass" style={{
          maxWidth: '850px',
          margin: '0 auto',
          textAlign: 'left',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--c-line)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>app.ts — @lulumails/sdk</span>
          </div>
          <pre style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--c-ink)',
            lineHeight: 1.7,
            overflowX: 'auto',
          }}>
            <span style={{ color: 'var(--c-muted)' }}>// Intégration en 3 lignes dans votre application SaaS ou Mobile</span>{'\n'}
            <span style={{ color: '#ec4899' }}>import</span> {'{'} LuluMails {'}'} <span style={{ color: '#ec4899' }}>from</span> <span style={{ color: 'var(--c-brand-strong)' }}>'@lulumails/sdk'</span>;{'\n\n'}
            <span style={{ color: '#ec4899' }}>const</span> lulu = <span style={{ color: '#ec4899' }}>new</span> <span style={{ color: '#3b82f6' }}>LuluMails</span>({'{'} apiKey: <span style={{ color: 'var(--c-brand-strong)' }}>'lm_live_9a8b7c6d'</span> {'}'});{'\n\n'}
            <span style={{ color: '#ec4899' }}>await</span> lulu.emails.<span style={{ color: '#3b82f6' }}>send</span>({'{'}{'\n'}
            {'  '}to: <span style={{ color: 'var(--c-brand-strong)' }}>'client@example.com'</span>,{'\n'}
            {'  '}templateId: <span style={{ color: 'var(--c-brand-strong)' }}>'tpl_welcome'</span>,{'\n'}
            {'  '}variables: {'{'} name: <span style={{ color: 'var(--c-brand-strong)' }}>'Lucio'</span> {'}'}{'\n'}
            {'}'}); <span style={{ color: 'var(--c-muted)' }}>// ➔ Basculement automatique Resend ➔ Brevo ➔ SMTP (0€)</span>
          </pre>
        </div>
      </section>

      {/* ROI / Savings Calculator Section */}
      <section style={{ background: 'var(--c-surface-sunken)', padding: 'var(--space-8) var(--space-6)', borderTop: '1px solid var(--c-line)', borderBottom: '1px solid var(--c-line)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            💰 Calculez vos économies mensuelles
          </h2>
          <p style={{ color: 'var(--c-muted)', marginBottom: 'var(--space-6)' }}>
            Déplacez le curseur pour voir combien vous économisez par rapport aux services traditionnels (SendGrid, Postmark, Mailgun).
          </p>

          <div className="card-glass" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 'var(--space-2)' }}>
                Volume d'emails par mois : <span style={{ color: 'var(--c-brand-strong)', fontSize: 'var(--text-xl)' }}>{monthlyVolume.toLocaleString('fr-FR')} emails</span>
              </label>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={monthlyVolume}
                onChange={e => setMonthlyVolume(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--c-brand)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
              <div style={{ padding: '16px', background: 'var(--c-danger-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--c-danger)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--c-danger)', fontWeight: 700, textTransform: 'uppercase' }}>Coût SendGrid / Mailgun</div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--c-danger)' }}>{sendgridCost} $/mois</div>
              </div>

              <div style={{ padding: '16px', background: 'var(--c-ok-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--c-ok)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--c-ok)', fontWeight: 700, textTransform: 'uppercase' }}>Coût avec LuluMails</div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--c-ok)' }}>0 €/mois</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Grid (Bento Grid) */}
      <section style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Pourquoi choisir la plateforme LuluMails ?
          </h2>
          <p style={{ color: 'var(--c-muted)' }}>
            Tout ce dont les développeurs et startups ont besoin pour envoyer des emails professionnels.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          <div className="card-glass">
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius)', background: 'var(--c-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-brand-strong)', marginBottom: 'var(--space-4)' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Moteur de Failover Intelligente</h3>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Basculement automatique instantané entre Brevo, Resend, MailerSend et SMTP. Zéro interruption même en cas d'épuisement d'un quota gratuit.
            </p>
          </div>

          <div className="card-glass">
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius)', background: 'var(--c-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-brand-strong)', marginBottom: 'var(--space-4)' }}>
              <Server size={22} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>BYOK (Bring Your Own Key)</h3>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Conservez l'entière propriété de vos comptes. Connectez vos propres clés API et crédentiels SMTP avec chiffrement AES-256-GCM.
            </p>
          </div>

          <div className="card-glass">
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius)', background: 'var(--c-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-brand-strong)', marginBottom: 'var(--space-4)' }}>
              <Code2 size={22} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>SDK Client & API REST</h3>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              SDK léger `@lulumails/sdk` et API REST compatible Node.js, Python, PHP, React Native et cURL.
            </p>
          </div>

          <div className="card-glass">
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius)', background: 'var(--c-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-brand-strong)', marginBottom: 'var(--space-4)' }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Éditeur de Templates HTML</h3>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Concevez des modèles de mails réutilisables avec injection dynamique de variables (ex: {"{{name}}, {{code}}"}) et prévisualisation instantanée.
            </p>
          </div>
        </div>
      </section>

      {/* Commercial Pricing Plans */}
      <section style={{ background: 'var(--c-surface-sunken)', padding: 'var(--space-8) var(--space-6)', borderTop: '1px solid var(--c-line)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              Tarification Commerciale & Offres
            </h2>
            <p style={{ color: 'var(--c-muted)' }}>
              Choisissez le plan adapté à la taille de vos projets.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
            {/* Free Plan */}
            <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Développeur Gratuit</div>
              <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>Idéal pour les projets persos et startups au lancement.</p>

              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--c-ink)', marginBottom: 'var(--space-4)' }}>
                0 € <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--c-muted)' }}>/ mois à vie</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-sm)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> 10 000 emails / mois (Cumul BYOK)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Jusqu'à 3 providers BYOK</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Accès API REST & SDK Client</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Éditeur de Templates de base</li>
              </ul>

              <button onClick={() => onOpenAuth('register')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Créer un compte gratuit
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderColor: 'var(--c-brand)', borderWidth: '2px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--c-brand)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                POPULAIRE
              </div>

              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Pro / Growth</div>
              <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>Pour les applications SaaS et boutiques en croissance.</p>

              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--c-brand-strong)', marginBottom: 'var(--space-4)' }}>
                19 € <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--c-muted)' }}>/ mois</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-sm)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Emails illimités (BYOK + Pool)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Providers BYOK illimités</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Basculement prioritaire 99.99% SLA</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Domaines personnalisés (DKIM/SPF)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Support réactif 24/7</li>
              </ul>

              <button onClick={() => onOpenAuth('register')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Essai Gratuit 14 Jours
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Entreprise</div>
              <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>Infrastructure dédiée et haut volume sur mesure.</p>

              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--c-ink)', marginBottom: 'var(--space-4)' }}>
                99 € <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--c-muted)' }}>/ mois</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-sm)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Tout du Plan Pro</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Serveurs SMTP dédiés & IP dédiées</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--c-ok)" /> Support d'intégration dédié par un ingénieur</li>
              </ul>

              <button onClick={() => onOpenAuth('register')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Contacter l'équipe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          Foire Aux Questions (FAQ)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="card-glass" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {openFaq === idx && (
                <p style={{ marginTop: '12px', color: 'var(--c-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-line)', padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Send size={20} color="var(--c-brand)" />
          <span style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem' }}>LuluMails</span>
        </div>
        <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)' }}>
          © {new Date().getFullYear()} LuluMails. La plateforme d'API Email Commerciale & Gratuite. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};
