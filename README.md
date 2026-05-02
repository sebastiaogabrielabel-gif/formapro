# FormaPro

Le copilote des formateurs indépendants — créez, vendez et pilotez vos formations avec l'IA.

## Démarrage rapide

### 1. Installe Node.js
Télécharge et installe Node.js LTS depuis https://nodejs.org/

### 2. Installe les dépendances
```bash
cd forma-pro
npm install
```

### 3. Configure les variables d'environnement
```bash
cp .env.local.example .env.local
# Édite .env.local avec tes clés Supabase, Anthropic, Stripe, Resend
```

### 4. Configure Supabase
1. Crée un projet sur https://supabase.com
2. Dans **SQL Editor**, colle et exécute le contenu de `supabase/schema.sql`
3. Dans **Authentication → Providers** :
   - Active **Google** (Client ID + Secret depuis Google Cloud Console)
   - Active **LinkedIn (OIDC)** (Client ID + Secret depuis LinkedIn Developers)
4. Dans **Authentication → URL Configuration** :
   - Site URL : `http://localhost:3000`
   - Redirect URLs : `http://localhost:3000/auth/callback`

### 5. Lance le serveur de développement
```bash
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

## Structure du projet

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Page de connexion split-screen
│   │   └── callback/       # Handler OAuth Supabase
│   ├── (dashboard)/
│   │   ├── dashboard/      # Dashboard principal (Module 3)
│   │   └── onboarding/     # Onboarding 6 étapes (Module 2)
│   ├── api/                # API Routes Next.js
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Sidebar, header
├── lib/
│   ├── supabase.ts         # Client Supabase (browser + server)
│   ├── supabase-admin.ts   # Client service role (server only)
│   ├── claude.ts           # Client Claude API
│   └── utils.ts            # cn() helper
└── types/
    └── database.ts         # Types TypeScript Supabase
```

## Variables d'environnement requises

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com |
| `RESEND_API_KEY` | resend.com |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` en dev |
