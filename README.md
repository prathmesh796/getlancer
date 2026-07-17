
# getLancer

getLancer is a simple and efficient freelancing platform, specially targeting people who are just entering the freelancing world — including students looking for their first professional experience.

## Features

- Direct messages between client / freelancer
- Google Calendar API integration
- Multiple login options (Google, GitHub)
- Enhanced profile and dashboards
- OTP-based email verification
- Cloudflare Turnstile CAPTCHA protection

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | MongoDB / Mongoose |
| Auth | NextAuth v4 (Google & GitHub OAuth) |
| Realtime / Messaging | Firebase |
| File Storage | Cloudflare R2 (S3-compatible) |
| Email | Nodemailer (Gmail SMTP) |
| Cache (optional) | Redis / ioredis |
| Styling | Tailwind CSS |

## Prerequisites

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later (bundled with Node.js)
- A [MongoDB](https://www.mongodb.com/atlas) instance (local or Atlas)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials
- A [GitHub OAuth App](https://github.com/settings/developers)
- A [Firebase](https://firebase.google.com/) project
- A [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket
- A [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) site

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/prathmesh796/getlancer.git
cd getlancer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set each variable. The table below describes every variable:

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Canonical URL of your app (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | ✅ | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | ✅ | GitHub OAuth client secret |
| `MONGO_URL` | ✅ | MongoDB connection URI |
| `EMAIL_USER` | ✅ | Gmail address used for sending OTPs |
| `EMAIL_PASS` | ✅ | Gmail App Password (not your account password) |
| `R2_ENDPOINT` | ✅ | Cloudflare R2 endpoint URL |
| `R2_ACCESS_KEY_ID` | ✅ | Cloudflare R2 access key ID |
| `R2_SECRET_ACCESS_KEY` | ✅ | Cloudflare R2 secret access key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ | Cloudflare Turnstile public site key |
| `TURNSTILE_SECRET_KEY` | ✅ | Cloudflare Turnstile secret key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase public API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |

#### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create a new **OAuth 2.0 Client ID** (Web application).
3. Add `http://localhost:3000/api/auth/callback/google` to **Authorised redirect URIs**.
4. Copy the **Client ID** and **Client Secret** into `.env.local`.

#### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → **New OAuth App**.
2. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`.
3. Copy the **Client ID** and generate a **Client Secret**, then add them to `.env.local`.

#### Setting up Gmail App Password

1. Enable 2-Step Verification on your Google account.
2. Go to [App Passwords](https://myaccount.google.com/apppasswords).
3. Generate a password for **Mail** and paste it into `EMAIL_PASS`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

## Running with Docker

Make sure Docker and Docker Compose are installed, then:

```bash
# Copy and fill in env variables
cp .env.example .env.local

# Build and start the container
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Screenshots

![Landing page](https://github.com/prathmesh796/getlancer/blob/main/public/Screenshot%202026-07-17%20155059.png)

![Sign up](https://github.com/prathmesh796/getlancer/blob/main/public/Screenshot%202026-07-17%20155138.png)

![Dashboard](https://github.com/prathmesh796/getlancer/blob/main/public/Screenshot%202026-07-17%20155205.png)

![Profile](https://github.com/prathmesh796/getlancer/blob/main/public/Screenshot%202025-04-30%20000252.png)

## Contributing

Contributions are welcome! Please read [CONTRIBUTION.md](CONTRIBUTION.md) for guidelines.

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.

