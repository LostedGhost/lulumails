import React, { useState } from 'react';
import { Send, Zap, ShieldCheck, Server, Code2, ArrowRight, CheckCircle2, DollarSign, ChevronDown, ChevronUp, Sparkles, Layers, Users, Globe, Lock, Play, Check, Plus } from 'lucide-react';
import { ThreeCanvasScene } from '../components/scene/ThreeCanvasScene';
import { Hero3DScene } from '../components/scene/Objects3D';

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

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const CAPACITES = [
    {
      icon: Zap,
      titre: "Moteur de Failover Intelligente",
      texte: "Basculement automatique instantané entre Brevo, Resend, MailerSend et Gmail SMTP. Zéro interruption d'envoi même si un quota est atteint.",
    },
    {
      icon: Server,
      titre: "BYOK (Bring Your Own Key)",
      texte: "Conservez l'entière propriété de vos comptes. Connectez vos propres clés API et crédentiels SMTP avec chiffrement sécurisé AES-256-GCM.",
    },
    {
      icon: Code2,
      titre: "SDK Client & API REST",
      texte: "Intégrez l'envoi d'emails en 3 lignes de code avec notre SDK officiel `@lulumails/sdk` disponible pour Node.js, TypeScript, Python, PHP et cURL.",
    },
    {
      icon: Layers,
      titre: "Templates HTML Dynamiques",
      texte: "Concevez des modèles de mails réutilisables avec injection de variables dynamiques (ex: {{name}}, {{code}}) et prévisualisation instantanée.",
    },
    {
      icon: ShieldCheck,
      titre: "Délivrabilité Optimale",
      texte: "Vos emails bénéficient de la réputation d'expédition exceptionnelle des meilleurs routeurs sans risquer le blocage ou le dossier spam.",
    },
    {
      icon: Globe,
      titre: "100% Gratuit & Illimité",
      texte: "Profitez du cumul des quotas gratuits de tous vos fournisseurs sans sortir votre carte bancaire ni payer d'abonnement.",
    },
  ];

  const ETAPES = [
    {
      n: "01",
      titre: "Enregistrez vos providers",
      texte: "Ajoutez vos clés d'API gratuites (Resend, Brevo, Gmail SMTP) dans votre espace sécurisé LuluMails.",
    },
    {
      n: "02",
      titre: "Intégrez l'API / SDK",
      texte: "Installez le SDK `@lulumails/sdk` et envoyez des emails en 3 lignes de code depuis votre application web ou mobile.",
    },
    {
      n: "03",
      titre: "Laissez faire le Failover",
      texte: "LuluMails gère automatiquement la rotation et le basculement d'un fournisseur à l'autre sans aucun frais.",
    },
  ];

  const FAQS = [
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
    <div style={{ background: 'var(--c-canvas)', color: 'var(--c-ink)', minHeight: '100vh', position: 'relative' }}>
      {/* WebGL 3D Background Canvas (Three.js floating particles) */}
      <ThreeCanvasScene />

      {/* ------------------------------------------------------------ Hero */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />

        {/* Floating CSS 3D Scene */}
        <Hero3DScene />

        <div className="shell hero-inner">
          {/* Badge Style LuluFiles */}
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
          }}>
            <Sparkles size={14} />
            <span>Moteur 3D API Email Commercial · 100% Gratuit</span>
          </div>

          <h1 className="hero-title">
            Envoyez des millions d'emails <br />
            <span className="hero-accent">sans débourser un centime</span>
          </h1>

          <p className="hero-lede">
            LuluMails agrège intelligemment les quotas gratuits des meilleurs routeurs (Resend, Brevo, MailerSend, SMTP) avec basculement automatique. Dites adieu aux factures SendGrid à 200$/mois.
          </p>

          <div className="hero-actions">
            <button onClick={() => onOpenAuth('register')} className="btn btn-brand btn-lg">
              <Plus size={18} />
              <span>Démarrer gratuitement</span>
            </button>
            <button onClick={onGoToDashboard} className="btn btn-outline btn-lg">
              <span>Accéder à la Console</span>
            </button>
          </div>

          <p className="hero-note">
            100% Gratuit · Sans carte bancaire · Accès illimité offert
          </p>

          {/* Snippet Code Style LuluFiles */}
          <div className="snippet">
            <div className="snippet-bar">
              <span className="snippet-dot" />
              <span className="snippet-dot" />
              <span className="snippet-dot" />
              <span className="snippet-title">email.ts — @lulumails/sdk</span>
            </div>
            <pre>
              <code>
                <span className="tk-cmd">import</span> {'{'} LuluMails {'}'} <span className="tk-cmd">from</span> <span className="tk-str">'@lulumails/sdk'</span>;{'\n\n'}
                <span className="tk-cmd">const</span> lulu = <span className="tk-cmd">new</span> <span className="tk-key">LuluMails</span>({'{'} apiKey: <span className="tk-str">'lm_live_a1b2c3d4'</span> {'}'});{'\n\n'}
                <span className="tk-cmd">await</span> lulu.emails.<span className="tk-key">send</span>({'{'}{'\n'}
                {"  "}to: <span className="tk-str">'client@domaine.com'</span>,{"\n"}
                {"  "}subject: <span className="tk-str">'Bienvenue sur l\'application'</span>,{"\n"}
                {"  "}html: <span className="tk-str">'&lt;h1&gt;Bonjour Thomas&lt;/h1&gt;'</span>{"\n"}
                {'}'}); <span className="tk-com">// ➔ Failover automatique Resend ➔ Brevo ➔ SMTP (0€)</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- ROI / Calculateur Economie */}
      <section className="section band">
        <div className="shell text-center">
          <div className="section-head">
            <h2>💰 Calculez vos économies mensuelles</h2>
            <p>Déplacez le curseur pour voir vos économies réelles par rapport à SendGrid ou Mailgun.</p>
          </div>

          <div style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--c-surface-raised)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--c-line)', boxShadow: 'var(--shadow)' }}>
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-base)' }}>
                Volume d'emails par mois : <span style={{ color: 'var(--c-brand-strong)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>{monthlyVolume.toLocaleString('fr-FR')} emails</span>
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

      {/* -------------------------------------------------------- Capacités / Bento Grid */}
      <section className="section shell" id="fonctionnalites">
        <header className="section-head text-center">
          <h2>Tout ce dont vous avez besoin, sans contrainte</h2>
          <p>
            Les limites des fournisseurs gratuits sont gérées automatiquement en arrière-plan. Vous profitez d'une infrastructure d'envoi fluide, puissante et entièrement gratuite.
          </p>
        </header>

        <div className="feature-grid">
          {CAPACITES.map(c => {
            const IconComp = c.icon;
            return (
              <article key={c.titre} className="feature">
                <span className="feature-icon">
                  <IconComp size={22} />
                </span>
                <h3>{c.titre}</h3>
                <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{c.texte}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------- Étapes */}
      <section className="section band">
        <div className="shell">
          <header className="section-head text-center">
            <h2>Trois étapes simples pour commencer</h2>
            <p>Prise en main immédiate en moins de 2 minutes pour votre application.</p>
          </header>

          <ol className="steps">
            {ETAPES.map(e => (
              <li key={e.n}>
                <span className="step-num">{e.n}</span>
                <h3>{e.titre}</h3>
                <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-sm)' }}>{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ Tarifs */}
      <section className="section shell" id="tarifs">
        <header className="section-head text-center">
          <h2>Tarification Commerciale & Offres</h2>
          <p>
            Profitez d'un accès complet et évolutif. Aucun frais caché ni surprise sur votre facture.
          </p>
        </header>

        <div className="pricing">
          {/* Plan Développeur Gratuit */}
          <article className="price-card text-center">
            <span className="price-flag">Offre de Lancement</span>
            <h3>Développeur Gratuit</h3>
            <div className="price-amount">
              0 <span style={{ fontSize: 'var(--text-sm)', color: 'var(--c-muted)', fontWeight: 400 }}>€ / mois à vie</span>
            </div>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)' }}>Parfait pour les projets persos et applications au démarrage.</p>
            <ul className="price-list">
              <li><Check size={16} color="var(--c-brand-strong)" /> 10 000 emails / mois gratuits (Cumul)</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> 3 Providers BYOK enregistrables</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Accès complet API REST & SDK Client</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Éditeur de Templates de base</li>
            </ul>
            <button onClick={() => onOpenAuth('register')} className="btn btn-outline btn-block">
              Créer mon compte gratuit
            </button>
          </article>

          {/* Plan Pro / Growth (Featured) */}
          <article className="price-card featured text-center">
            <span className="price-flag" style={{ background: 'var(--c-brand)' }}>POPULAIRE</span>
            <h3>Pro / Growth</h3>
            <div className="price-amount" style={{ color: 'var(--c-brand-strong)' }}>
              19 <span style={{ fontSize: 'var(--text-sm)', color: 'var(--c-muted)', fontWeight: 400 }}>€ / mois</span>
            </div>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)' }}>Pour les applications SaaS et entreprises en forte croissance.</p>
            <ul className="price-list">
              <li><Check size={16} color="var(--c-brand-strong)" /> Emails illimités (BYOK + Pool)</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Providers BYOK illimités</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Basculement prioritaire 99.99% SLA</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Domaines personnalisés (DKIM/SPF)</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Support réactif 24/7 par un ingénieur</li>
            </ul>
            <button onClick={() => onOpenAuth('register')} className="btn btn-brand btn-block btn-lg">
              Essai Gratuit 14 Jours
            </button>
          </article>

          {/* Plan Entreprise */}
          <article className="price-card text-center">
            <h3>Entreprise</h3>
            <div className="price-amount">
              99 <span style={{ fontSize: 'var(--text-sm)', color: 'var(--c-muted)', fontWeight: 400 }}>€ / mois</span>
            </div>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--text-xs)' }}>Infrastructure dédiée haut volume et garanties sur mesure.</p>
            <ul className="price-list">
              <li><Check size={16} color="var(--c-brand-strong)" /> Tout du Plan Pro</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Serveurs SMTP dédiés & IP dédiées</li>
              <li><Check size={16} color="var(--c-brand-strong)" /> Support d'intégration dédié sur-mesure</li>
            </ul>
            <button onClick={() => onOpenAuth('register')} className="btn btn-outline btn-block">
              Contacter l'équipe
            </button>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className="section shell" style={{ maxWidth: '800px' }}>
        <header className="section-head text-center">
          <h2>Foire Aux Questions (FAQ)</h2>
          <p>Toutes les réponses à vos questions sur le fonctionnement de LuluMails.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} className="feature" style={{ padding: '16px 20px', cursor: 'pointer', textAlign: 'left', alignItems: 'stretch' }} onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 'var(--text-base)' }}>
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

      {/* --------------------------------------------------------------- CTA Band */}
      <section className="section cta-band">
        <div className="shell text-center">
          <h2>Envoyez vos emails dès aujourd'hui, <span className="hero-accent">100% gratuitement</span></h2>
          <p style={{ color: 'var(--c-muted)', maxWidth: '54ch', margin: '0 auto var(--space-5)' }}>
            Profitez dès maintenant d'une infrastructure d'envoi d'emails haute performance et sans facture mensuelle.
          </p>
          <button onClick={() => onOpenAuth('register')} className="btn btn-brand btn-lg">
            <Plus size={18} />
            <span>Créer mon compte gratuit</span>
          </button>
        </div>
      </section>

      {/* --------------------------------------------------------------- Footer */}
      <footer className="site-footer">
        <div className="shell site-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={20} color="var(--c-brand)" />
            <span className="marque brand-nom">LuluMails</span>
          </div>

          <div style={{ fontSize: 'var(--text-xs)' }}>
            © {new Date().getFullYear()} LuluMails. La plateforme d'API Email Commerciale & Gratuite. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};
