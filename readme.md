# Habit Tracker

A full-stack habit tracking application that helps users build, maintain, and track daily habits — with an AI-powered chat assistant, streak tracking, notes, push notifications, and a native Android app.

**Web:** [habit.proteinslice.com](https://habit.proteinslice.com)  
**Android:** [Google Play Store](https://play.google.com/store/apps/details?id=com.proteinslice.habit)

---

## Features

- **Habit Management** — Create, edit, and delete habits with flexible repeat schedules (daily, weekly, monthly, hourly, or one-time todos)
- **Habit Types** — Regular habits, negative habits (marked done by default, unmark to flag), and todo-style one-time tasks
- **Streak Tracking** — Track consecutive completions and view streak history
- **AI Chat Assistant** — LangChain + OpenAI-powered assistant that can create, edit, list, and manage habits via natural language
- **Notes** — Attach notes to habits or keep a standalone journal
- **Suggested Habits** — Pre-seeded habit library to help users get started
- **Push Notifications** — Firebase Cloud Messaging (FCM) for habit reminders on web and Android
- **Google OAuth** — Sign in with Google alongside email/password auth
- **Email Verification** — OTP-based email verification on registration
- **Password Reset** — Forgot password flow via email (AWS SES)
- **Timer** — Built-in timer for timed habits
- **Archive** — Archive habits without deleting them
- **Profile Management** — Edit profile, change password, notification preferences, delete account

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | API server |
| MongoDB + Mongoose | Primary database |
| Redis | Caching / session data |
| JSON Web Tokens (JWT) | Authentication |
| Google Auth Library | Google OAuth verification |
| LangChain + LangGraph | AI agent orchestration |
| OpenAI GPT-4.1-mini | AI chat assistant model |
| Nodemailer + AWS SES | Transactional email |
| express-rate-limit | Rate limiting (100 req/hr) |
| Zod | Schema validation |
| Vercel | Deployment |

### Worker (Go)
| Technology | Purpose |
|---|---|
| Go 1.23 | Background worker runtime |
| MongoDB (mongo-driver) | Reads habit/user data |
| Redis (redigo) | Pub/sub and caching |
| Firebase Admin SDK | Sends FCM push notifications |
| Cloudinary | Profile image handling |
| Uber Zap | Structured logging |
| Docker | Containerized deployment |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router 7 | Client-side routing |
| Redux Toolkit | Global state management |
| TailwindCSS 4 | Styling |
| Radix UI / shadcn | Accessible UI components |
| Capacitor 8 | Native Android wrapper |
| Firebase (FCM) | Push notifications |
| Axios | HTTP client |
| React Hook Form | Form management |
| TanStack Table | Data tables |

---

## Project Structure

```
habit/
├── backend/                   # Node.js + Express API server
│   ├── src/
│   │   ├── controller/        # Route handlers
│   │   │   ├── user.controller.js
│   │   │   ├── taks.controller.js    # Habit CRUD
│   │   │   ├── chat.controller.js    # AI chat
│   │   │   ├── note.controller.js
│   │   │   ├── suggested.controller.js
│   │   │   └── app.controller.js     # App version / device
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── habit.model.js
│   │   │   ├── Streak.model.js
│   │   │   ├── Notes.model.js
│   │   │   ├── suggestedHabit.model.js
│   │   │   ├── device.mdel.js
│   │   │   └── feedback.js
│   │   ├── routers/           # Express routers
│   │   ├── middleware/        # JWT auth middleware
│   │   ├── helpers/           # Business logic & AI tools
│   │   ├── db/                # MongoDB + Redis connections
│   │   ├── utils/             # ApiError, ApiResponse, asyncHandler, Email
│   │   ├── emailTemplets/     # Email HTML templates
│   │   ├── seeds/             # Suggested habits seed data
│   │   └── app.js             # Express app setup
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── worker/                    # Go background worker service
│   ├── helpers/               # Core worker logic
│   │   ├── scheduler.go       # Cron-style job scheduler
│   │   ├── userNotification.go # Habit reminder notifications
│   │   ├── firebase.go        # FCM push notification sender
│   │   ├── mongohelper.go     # MongoDB queries
│   │   ├── redis.go           # Redis connection
│   │   ├── cleaner.go         # Stale data cleanup
│   │   ├── imagehandler.go    # Cloudinary image processing
│   │   └── logger.go          # Zap logger setup
│   ├── models/models.go       # Shared Go structs (User, Habit)
│   ├── main.go                # Entry point
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   └── go.mod
│
└── frontend/                  # React + Vite web & Android app
    ├── src/
    │   ├── components/
    │   │   ├── auth/          # Login, Register, OTP, Google OAuth
    │   │   ├── Habit/         # Habit list, add/edit, mark streak, archive
    │   │   ├── Steak/         # Streak list and streak page
    │   │   ├── chat/          # AI chat interface
    │   │   ├── Notes/         # Notes CRUD
    │   │   ├── Timer/         # Habit timer
    │   │   ├── Home/          # Home dashboard
    │   │   ├── profile/       # Profile, notifications, support
    │   │   ├── navbar/        # Navigation bar
    │   │   ├── ui/            # Radix/shadcn base components
    │   │   └── etc/           # Privacy, Terms, Delete account
    │   ├── App.jsx
    │   └── Layout.jsx
    ├── android/               # Capacitor Android project
    ├── capacitor.config.json
    ├── .env.example
    └── package.json
```

---

## API Routes

| Prefix | Description |
|---|---|
| `GET /ping` | Health check |
| `POST /api/v1/users/register` | Register new user |
| `POST /api/v1/users/login` | Email/password login |
| `POST /api/v1/users/login-google` | Google OAuth login |
| `POST /api/v1/users/verify` | Verify OTP |
| `POST /api/v1/users/forgot-password` | Request password reset |
| `GET /api/v1/users/renew-token` | Refresh access token |
| `GET /api/v1/users/current` | Get current user (auth) |
| `POST /api/v1/users/details` | Update profile (auth) |
| `POST /api/v1/users/password` | Change password (auth) |
| `POST /api/v1/users/fcm-token` | Set FCM token (auth) |
| `POST /api/v1/users/feedback` | Submit feedback (auth) |
| `POST /api/v1/users/close-account` | Delete account (auth) |
| `/api/v1/steak/*` | Streak management |
| `/api/v1/chat/*` | AI chat assistant |
| `/api/v1/app/version` | Minimum app version |
| `/api/v1/app/device` | Register device |
| `/api/v1/notes/*` | Notes CRUD |
| `/api/v1/suggested/*` | Suggested habits |

---

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) (frontend uses bun.lock) or npm
- [MongoDB](https://www.mongodb.com/) instance
- [Redis](https://redis.io/) instance
- OpenAI API key (for AI chat)
- Google OAuth client ID
- AWS SES credentials (for email)
- Firebase project (for push notifications) + service account JSON for the worker
- [Go](https://golang.org/) 1.23+ (for the worker service)
- [Docker](https://www.docker.com/) (optional, for containerized worker deployment)

### Backend

```bash
cd backend
cp .env.example .env
# Fill in .env values (see below)
npm install
npm run dev        # development with nodemon
npm start          # production
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Fill in .env values (see below)
bun install        # or npm install
bun run dev        # development server
bun run build      # production build
```

### Worker

```bash
cd worker
cp .env.example .env
# Fill in .env values (see below)
go run main.go

# Or with Docker
docker-compose up --build
```

### Android (Capacitor)

```bash
cd frontend
bun run build
npx cap sync android
# Open android/ in Android Studio and run
```

---

## Environment Variables

### Backend `.env`

```env
PORT=
MONGODB_URI=
CORS_ORIGIN=                  # semicolon-separated allowed origins

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

AWS_SES_USER=                 # SMTP user for email
AWS_SES_PASS=                 # SMTP password

NODE_ENV=                     # development | production
MONGO_DB=                     # database name

REDIS_HOST=
REDIS_PWD=
```

### Worker `.env`

```env
MONGODB_URI=
MONGO_DB=
REDIS_HOST=
REDIS_PWD=
CLOUDINARY_CLOUD_NAME=        # for profile image handling
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# Place Firebase service account JSON as firebase.json in worker root
```

### Frontend `.env`

```env
VITE_BACKEND_URL=             # production API base URL
VITE_BACKEND_URL_DEVELOPMENT= # local API base URL
VITE_GOOGLE_CLIENT_ID=        # Google OAuth client ID
VITE_ENV=                     # development | production
VITE_SECRET_KEY=              # encryption key for local storage
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with clear messages.
4. Open a pull request with a description of the changes.

For significant changes, open an issue first to discuss the approach.

---

## License

MIT License

## Contact

GitHub: [shubgoyal23](https://github.com/shubgoyal23)
