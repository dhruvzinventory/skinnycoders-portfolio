# SkinnyCoders — IT & Growth Engineering Agency Platform

Production-ready web platform and backend API for **SkinnyCoders**, an elite IT service provider agency delivering scalable software engineering, AI vector search, cloud infrastructure, and data-driven marketing solutions.

---

## ⚡ Backend REST API Endpoints

SkinnyCoders now features an active, production-grade Node.js/Express backend (`server.js`) that handles dynamic operations and lead capture:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime, status heartbeat & environment diagnostics | None (Public) |
| `POST` | `/api/leads` | Validates client inquiry data and securely stores prospective client leads | None (Public) |
| `GET` | `/api/leads` | Administrative inspection of all captured proposal inquiries | `x-api-key` Header |
| `GET` | `/api/projects` | Dynamic JSON catalog of agency client deliverables & case studies | None (Public) |

---

## ⚠️ CRITICAL HOSTING NOTICE: GitHub Pages Compatibility

> ### 🛑 Why you CANNOT host this full backend on GitHub Pages:
> **GitHub Pages ONLY hosts static client-side files (`.html`, `.css`, `.js`, images).**  
> GitHub Pages does **NOT** provide a Node.js or Python runtime environment. It cannot run `server.js`, cannot listen on backend ports, and cannot execute backend API endpoints like `POST /api/leads`.

### Where to Deploy Instead:

1. **All-in-One Cloud Hosting (Recommended & Free):**
   - **[Render.com](https://render.com) or [Railway.app](https://railway.app):**
     - Connect your GitHub repository.
     - Set Build Command: `npm install`
     - Set Start Command: `npm start`
     - Both your frontend website and backend REST API will run together on a live public URL (e.g., `https://skinnycoders.onrender.com`) with automated SSL.
2. **Cloud VPS / Docker (AWS / DigitalOcean):**
   - Run on an EC2 instance or Droplet using `pm2 start server.js` behind an NGINX reverse proxy.
3. **Hybrid Setup (Static Frontend + External API):**
   - You *can* host `index.html` on GitHub Pages if you host `server.js` on Render/Railway, and configure `script.js` to send requests to `https://your-api.onrender.com/api/leads`.

---

## 🛠️ Project Structure
```
skinnycoders-portfolio/
├── server.js          # Express backend API & static web server
├── package.json       # Node.js dependencies & scripts
├── .env.example       # Environment configuration template
├── .gitignore         # Ignores node_modules, private leads.json, and .env
├── index.html         # Agency frontend with animated SVG logo & hero console
├── logo-showcase.html # Standalone brand identity preview page
├── styles.css         # Responsive Sora-powered dark-theme styling
├── script.js          # Interactive filters, console tabs & API fetch integration
└── README.md          # Documentation & deployment guide
```

---

## 💻 Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Backend API & Web Server:**
   ```bash
   npm start
   ```
   *The server will start at `http://localhost:5000` serving both the full interactive website and the REST API endpoints.*

3. **Verify API Health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Inspect Captured Leads (Admin):**
   ```bash
   curl http://localhost:5000/api/leads -H "x-api-key: skinny_admin_secret_key_change_me"
   ```
