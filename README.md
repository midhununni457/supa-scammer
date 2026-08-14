# SupaScammer

**SupaScammer** is an automated database keep-alive service designed to prevent free-tier Supabase (and PostgreSQL) databases from pausing due to inactivity.

Simply submit your database connection string—SupaScammer tests the connection, encrypts your connection credentials using AES-256-CBC, and periodically pings your database to keep it active.

---

## Features

- **Automated Pinging**: Runs a daily `node-cron` job (`0 0 * * *`) executing `SELECT 1` queries to keep databases active.
- **AES-256-CBC Security**: Connection strings are securely encrypted at rest using AES-256-CBC before storing them in the database.
- **Connection Pre-validation**: Connection strings are tested in real time before being saved.
- **Auto-Cleanup**: Tracks connection errors for each database and automatically removes entries exceeding 10 consecutive failed pings.
- **Modern UI**: Clean, responsive React 19 + Tailwind CSS frontend with dynamic connection status detection.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **State/Hooks**: React Hooks (`useState`, `useEffect`)

### Backend
- **Server**: Express.js
- **Database / ORM**: PostgreSQL + Prisma ORM
- **Scheduler**: `node-cron`
- **Driver**: `pg` (PostgreSQL Client)
- **Security**: Node.js `crypto` module (AES-256-CBC encryption)

---

## Repository Structure

```
supa-scammer/
├── backend/
│   ├── controllers/      # Express route controllers (UrlController)
│   ├── db/               # Database operations wrapper via Prisma
│   ├── prisma/           # Prisma schema & migration files
│   ├── routes/           # API endpoints routing
│   ├── utils/            # AES-256 encryption & cron pinger utilities
│   ├── server.js         # Entry point for backend server & cron initialization
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main application component & connection ping logic
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Tailwind CSS styles
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A PostgreSQL database instance (for the backend data store)

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `backend` directory:
   ```env
   PORT=3001
   DATABASE_URL="postgresql://user:password@localhost:5432/supascammer?schema=public"
   DIRECT_URL="postgresql://user:password@localhost:5432/supascammer?schema=public"
   ENCRYPTION_KEY="your-secure-random-encryption-key"
   ```

4. **Run Prisma Migrations & Generate Client:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:3001` and start the daily ping cron job.*

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `frontend` directory:
   ```env
   VITE_BACKEND_URL="http://localhost:3001"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The frontend application will start (typically at `http://localhost:5173`).*

---

## API Endpoints

| Method | Endpoint    | Description |
| :---   | :---        | :--- |
| `GET`  | `/api/ping` | Health check endpoint used by frontend to verify server connectivity |
| `POST` | `/api/urls` | Accepts `{ url }`, tests DB connection, encrypts, and stores valid connection string |

---

## Security

Database connection strings contain sensitive connection details. SupaScammer protects user credentials by deriving a SHA-256 hash from `ENCRYPTION_KEY` and encrypting each string via **AES-256-CBC** with a unique Initialization Vector (IV) before inserting into the database.

---

## Automated Daily Pings (GitHub Actions)

This project includes a GitHub Actions workflow (`.github/workflows/daily-ping.yml`) that automatically executes daily database pings at `00:00 UTC` without needing a 24/7 server running.

### Setting Up GitHub Repository Secrets

To enable automated pings:
1. Go to your repository on GitHub.
2. Click **Settings** > **Secrets and variables** > **Actions**.
3. Add the following **Repository secrets**:
   - `DATABASE_URL`: Your database connection URL.
   - `DIRECT_URL`: Direct database connection URL (for Prisma/Supabase).
   - `ENCRYPTION_KEY`: The AES-256 encryption key matching your backend `.env`.

---

## License

This project is licensed under the ISC License.
