# FocusMate AI

> Un compagnon virtuel intelligent qui lutte contre la procrastination.

## Vision

FocusMate AI n'est pas une simple Todo List. C'est un **coach personnel** doté d'une personnalité qui accompagne l'utilisateur quotidiennement, apprend ses habitudes, adapte ses conseils et encourage sans être intrusif.

## Stack technique

### Frontend
- **React Native** + **Expo** (SDK 57)
- **TypeScript** 6
- **Expo Router** (navigation file-based)
- **NativeWind** (Tailwind CSS pour RN)
- **Zustand** (state management)
- **React Query** (server state)
- **React Hook Form** + **Zod** (formulaires + validation)
- **Moti** (animations)
- **Victory Native** (graphiques)
- **Expo Notifications** + **Expo Secure Store**

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** + **Alembic** (ORM + migrations)
- **PostgreSQL** (Supabase)
- **JWT** (authentification)
- **Pydantic** (validation)
- **Gemini API** (IA)

## Fonctionnalités

- Authentification (inscription/connexion persistante)
- Dashboard avec avatar 2D, citation motivante, objectifs du jour
- Gestion des objectifs (CRUD, progression, priorités, catégories)
- Habitudes avec calcul automatique de streaks
- Statistiques avec graphiques
- Chat IA contextuel (Gemini API + fallback local)
- Avatar SVG animé (5 moods)
- Notifications intelligentes

## Architecture

```
focusmate-ai/
├── app/                    # Routes Expo Router
│   ├── (auth)/            # Écrans authentification
│   ├── (tabs)/            # Navigation principale
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── habits/
│   │   ├── stats/
│   │   ├── chat/
│   │   └── profile/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── ui/            # Button, Input, Card, AvatarSVG, GoalCard...
│   │   └── layout/        # PageHeader, etc.
│   ├── features/          # Validation Zod par feature
│   ├── hooks/             # Custom hooks (useAuth, useGoals, useChat...)
│   ├── services/          # API client, auth, AI, notifications
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   ├── constants/         # Couleurs, citations, catégories
│   └── utils/             # Streaks, helpers
├── backend/
│   ├── app/
│   │   ├── core/          # Config, DB, Security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   └── alembic/           # Migrations
└── __tests__/             # Tests unitaires
```

## Installation

### Frontend

```bash
npm install --legacy-peer-deps
npx expo start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure ta DB
alembic upgrade head
uvicorn app.main:app --reload
```

## Tests

```bash
npm test
npm run lint  # TypeScript check
```

## Déploiement

- **Frontend** : Expo (EAS Build) → APK Android / IPA iOS
- **Backend** : Render (free tier)
- **Database** : Supabase (free tier)
- **CI/CD** : GitHub Actions

## Design

Inspirations : Duolingo, Headspace, Notion, Google Fit.
- Dark mode par défaut
- Coins arrondis, animations fluides
- Palette : violet primary (#7c4dff), teal accent (#00bcd4)

## Licence

MIT
