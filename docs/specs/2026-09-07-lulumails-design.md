# Document de Design Master - LuluMails

> **Spécification Technique & Design System**
> **Projet :** LuluMails (Plateforme d'envoi d'emails transactionnels et de masse)
> **Date :** 2026-09-07
> **Statut :** Approuvé
> **Repository Git :** https://github.com/LostedGhost/lulumails.git

---

## 1. Contexte & Objectifs

**LuluMails** est un système intelligent et flexible d'envoi d'emails transactionnels et de masse. Il permet aux applications web, mobiles et utilisateurs finaux d'envoyer des emails via une API REST sécurisée ou un Dashboard d'administration.

### Objectifs Principaux
1. **Moteur Multi-Fournisseurs & Failover Automatique** : Agrégation de services gratuits (Resend, Brevo, Mailersend, Gmail SMTP, Custom SMTP) avec basculement automatique en cas d'erreur ou d'épuisement de quota.
2. **Bring Your Own Key (BYOK)** : Prise en charge des identifiants et clés API propres à chaque utilisateur/projet en priorité.
3. **Dashboard Web & Éditeur de Templates** : Interface d'administration moderne avec gestion des clés API, des templates (WYSIWYG/HTML), des logs d'envoi et des statistiques.
4. **Design System LuluFiles** : Héritage direct de la charte visuelle de LuluFiles (Rubik, Itim, JetBrains Mono, palette Slate/Green, Glassmorphism, animations fluides 180ms).
5. **SDK Client & Intégration Facile** : Package JS/TS léger et documentation API Swagger/OpenAPI.

---

## 2. Architecture Technique

### Stack Logicielle
* **Backend** : Node.js (TypeScript) + Fastify (API REST haute performance).
* **Database & ORM** : PostgreSQL + Drizzle ORM (typé, migrations rapides).
* **File d'Attente & Workers** : BullMQ (ou Queue PostgreSQL/Mémoire avec retry exponentiel et circuit breaker).
* **Frontend Dashboard** : React 19 + Vite + TypeScript.
* **Styling** : Vanilla CSS Tokens (Design System LuluFiles).

### Structure des Dossiers
```
LuluMails/
├── backend/
│   ├── src/
│   │   ├── config/          # Variables d'environnement & constantes
│   │   ├── db/              # Schéma Drizzle & migrations PostgreSQL
│   │   ├── engine/          # Moteur d'envoi, adaptateurs providers & failover
│   │   ├── modules/         # Routes Fastify (auth, keys, emails, templates, logs)
│   │   ├── queue/           # Worker & file d'attente d'envoi
│   │   └── server.ts        # Point d'entrée Fastify
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Components (Buttons, Cards, Inputs, Modals, Layout)
│   │   ├── styles/          # tokens.css (Design System LuluFiles) & global.css
│   │   ├── pages/           # Dashboard, API Keys, Templates, Logs, Campaign
│   │   └── App.tsx
└── sdk/                     # SDK TypeScript/JavaScript officiel LuluMails
```

---

## 3. Schéma de la Base de Données (PostgreSQL / Drizzle)

* **`users`** : Comptes d'administration. (`id`, `email`, `password_hash`, `name`, `created_at`, `updated_at`).
* **`api_keys`** : Clés d'API client. (`id`, `user_id`, `name`, `key_prefix`, `key_hash`, `status`, `created_at`, `last_used_at`).
* **`provider_credentials`** : Clés API / Identifiants SMTP (BYOK & Pool). (`id`, `user_id`, `provider_type`, `name`, `config` [JSON chiffré AES-256], `daily_limit`, `current_daily_usage`, `priority`, `is_active`).
* **`email_templates`** : Modèles d'emails réutilisables. (`id`, `user_id`, `name`, `slug`, `subject`, `body_html`, `body_text`, `variables`, `created_at`).
* **`email_logs`** : Historique et traçabilité. (`id`, `user_id`, `api_key_id`, `provider_used`, `recipient`, `subject`, `status`, `error_message`, `attempt_count`, `sent_at`).

---

## 4. Design System LuluFiles (`tokens.css`)

### Typographie
* **Police Marque** : **Itim** (Uniquement pour le nom « LuluMails » dans l'en-tête/footer).
* **Police Interface** : **Rubik** (Axe variable 300..900) pour tous les titres et textes d'UI.
* **Police Code** : **JetBrains Mono** / **Cascadia Code** pour clés API et payloads JSON.

### Palette Chromatique
* **Mode Clair (Défaut)** : Fond `--c-canvas: #f1f5f9`, surfaces `--c-surface: #ffffff`, texte `--c-ink: #0f172a`, accentuation `--c-brand: #16a34a`.
* **Mode Sombre (`[data-theme="dark"]`)** : Fond `--c-canvas: #020617`, surfaces `--c-surface: #0f172a`, texte `--c-ink: #f8fafc`, accentuation `--c-brand: #22c55e`.
* **États** : `--c-ok: #15803d` (Succès), `--c-warn: #b45309` (Retry), `--c-danger: #b91c1c` (Erreur).

### Règles d'UI
* Icônes SVG exclusivement (**Lucide React**), pas d'emojis.
* Glassmorphism (`backdrop-filter: blur(12px)`), ombres subtiles `--shadow-sm`, `--shadow`.
* Transition d'état 180ms `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 5. Moteur d'Envoi, BYOK & Failover

1. Réception de la requête d'envoi `POST /v1/emails/send`.
2. Hachage et vérification de la clé API client `lm_live_...`.
3. Récupération des crédentiels de providers configurés :
   - Priorité aux crédentiels BYOK de l'utilisateur.
   - Repli (*fallback*) sur le pool partagé si BYOK absents ou quotas atteints (`current_daily_usage >= daily_limit`).
4. Tentative d'envoi via le Provider 1 :
   - **Succès** -> Statut `SENT`, incrémentation du compteur du provider, log enregistré.
   - **Échec (Rate limit 429 / Erreur 5xx / Timeout)** -> Enregistrement de la tentative et basculement automatique (*failover*) immédiat vers le Provider 2.
5. Si tous les providers échouent -> Inscription en file de retry / Statut `FAILED`.

---

## 6. Sécurité, Tests & Déploiement

* **Chiffrement** : AES-256-GCM pour les secrets SMTP & API keys dans PostgreSQL.
* **Rate Limiting** : Protection des endpoints API via Fastify Rate Limit.
* **Tests** :
  * Tests unitaires Vitest (Moteur d'envoi, templating, chiffrement).
  * Tests d'intégration Fastify pour les routes d'API.
  * Tests E2E pour le Dashboard React.
