// SkinnyCoders Production API & Web Server
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Assets
app.use(express.static(__dirname));

// Initialize local leads persistence file if not present
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// ==========================================
// API ENDPOINTS
// ==========================================

/**
 * 1. GET /api/health
 * Public health check and heartbeat endpoint
 */
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'SkinnyCoders Core Engine API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * 2. POST /api/leads
 * Handles client contact submissions, input validation, and lead persistence
 */
app.post('/api/leads', (req, res) => {
  try {
    const { name, email, service, budget, details } = req.body;

    // Strict input validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    if (!service) {
      return res.status(400).json({ success: false, error: 'Please select a primary service.' });
    }

    if (!details || details.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Please provide a brief project overview (min 5 characters).' });
    }

    // Construct new lead record
    const newLead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service,
      budget: budget || 'not_specified',
      details: details.trim(),
      clientIp: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      createdAt: new Date().toISOString(),
      status: 'pending_review'
    };

    // Persist to leads database file
    const fileData = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(fileData || '[]');
    leads.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');

    console.log(`[LEAD RECEIVED] ${newLead.name} (${newLead.email}) requested: ${newLead.service} | Budget: ${newLead.budget}`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your proposal request has been logged successfully. A senior engineer will review your project and email you within 12-24 hours.',
      leadId: newLead.id
    });
  } catch (error) {
    console.error('[API ERROR] Failed to record lead:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error processing proposal. Please email hello@skinnycoders.com directly.'
    });
  }
});

/**
 * 3. GET /api/leads
 * Protected lead inspection endpoint
 */
app.get('/api/leads', (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const adminKey = process.env.ADMIN_API_KEY || 'skinny_secret_123';

  if (apiKey !== adminKey) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid API key.' });
  }

  try {
    const fileData = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(fileData || '[]');
    return res.status(200).json({ success: true, count: leads.length, leads });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve leads.' });
  }
});

/**
 * 4. GET /api/projects
 * Dynamic case studies and project data
 */
app.get('/api/projects', (req, res) => {
  return res.status(200).json({
    success: true,
    projects: [
      {
        id: 'luxewayride',
        title: 'LuxeWayRide — Travel Agency Ride Booking Platform',
        category: 'tech',
        liveUrl: 'https://luxewayride.com',
        stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Vercel Edge']
      },
      {
        id: 'contextiq',
        title: 'ContextIQ — Multi-Document Q&A & Fact Verification',
        category: 'tech',
        stack: ['Python', 'FastAPI', 'FAISS Vector DB', 'BM25', 'React.js', 'GenAI']
      },
      {
        id: 'repo-explorer',
        title: 'Repo Explorer — GitHub Platform with Redis & K8s',
        category: 'cloud',
        liveUrl: 'https://gitrepoexplorer.vercel.app',
        stack: ['Kubernetes (EKS)', 'Terraform', 'Redis', 'Docker', 'GitHub Actions']
      },
      {
        id: 'skillswap',
        title: 'SkillSwap — Peer-to-Peer Knowledge Exchange',
        category: 'tech',
        stack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS']
      }
    ]
  });
});

// Fallback to index.html for Single-Page Application routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SkinnyCoders Backend API & Web Server is running!`);
  console.log(`🔗 Local Address:   http://localhost:${PORT}`);
  console.log(`🏥 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📥 Leads Endpoint:  http://localhost:${PORT}/api/leads`);
  console.log(`📂 Projects:        http://localhost:${PORT}/api/projects`);
  console.log(`======================================================\n`);
});
