import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface SiteData {
  profilePhoto: string | null;
  profilePhotoTimestamp?: number;
  projectPhotos: Record<string, string>;
  driveUrl: string | null;
}

function loadSiteData(): SiteData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading site data:', err);
  }
  return {
    profilePhoto: null,
    projectPhotos: {},
    driveUrl: null,
  };
}

function saveSiteData(data: SiteData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving site data:', err);
  }
}

// Helper to save base64 dataURL to disk
function saveBase64Image(dataUrl: string, targetPath: string): boolean {
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return false;
    }
    const buffer = Buffer.from(matches[2], 'base64');
    fs.writeFileSync(targetPath, buffer);
    return true;
  } catch (err) {
    console.error('Failed to write image file:', err);
    return false;
  }
}

async function startServer() {
  const app = express();

  // Support large base64 photo uploads (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Enable CORS for all origins (ensures friends, Vercel, and shared links can fetch media)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Serve uploads statically
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Get current shared media configuration
  app.get('/api/media', (req, res) => {
    const data = loadSiteData();
    res.json(data);
  });

  // Upload or update profile photo (shared for all visitors)
  app.post('/api/media/profile', (req, res) => {
    const { photo } = req.body;
    if (!photo || typeof photo !== 'string') {
      return res.status(400).json({ error: 'Photo dataUrl requise' });
    }

    const timestamp = Date.now();
    const uploadFilePath = path.join(UPLOADS_DIR, 'profile.jpg');
    const publicDefaultPath = path.join(process.cwd(), 'public', 'photo.jpg');
    const distDefaultPath = path.join(process.cwd(), 'dist', 'photo.jpg');
    const distUploadPath = path.join(process.cwd(), 'dist', 'uploads', 'profile.jpg');

    // Save image to disk
    const saved = saveBase64Image(photo, uploadFilePath);
    if (!saved) {
      return res.status(500).json({ error: 'Impossible de sauvegarder le fichier image' });
    }

    // Also overwrite public/photo.jpg so that even default fallbacks show the real photo
    try {
      fs.copyFileSync(uploadFilePath, publicDefaultPath);
    } catch (e) {
      console.warn('Could not copy to public/photo.jpg:', e);
    }

    // If dist exists, copy there too for instant production serving
    try {
      const distUploadsDir = path.join(process.cwd(), 'dist', 'uploads');
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
      }
      fs.copyFileSync(uploadFilePath, distUploadPath);
      if (fs.existsSync(distDefaultPath)) {
        fs.copyFileSync(uploadFilePath, distDefaultPath);
      }
    } catch (e) {
      // dist might not exist yet in dev mode
    }

    // Save metadata in site-data.json
    const siteData = loadSiteData();
    siteData.profilePhoto = `/uploads/profile.jpg?v=${timestamp}`;
    siteData.profilePhotoTimestamp = timestamp;
    saveSiteData(siteData);

    console.log(`[Media] Profile photo updated successfully for all visitors (timestamp: ${timestamp})`);

    return res.json({
      success: true,
      profilePhoto: siteData.profilePhoto,
      timestamp,
    });
  });

  // Upload or update a project photo
  app.post('/api/media/projects', (req, res) => {
    const { projectId, photo } = req.body;
    if (!projectId || !photo) {
      return res.status(400).json({ error: 'projectId et photo requis' });
    }

    const timestamp = Date.now();
    const sanitizedId = String(projectId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `project_${sanitizedId}.jpg`;
    const uploadFilePath = path.join(UPLOADS_DIR, filename);

    const saved = saveBase64Image(photo, uploadFilePath);
    if (!saved) {
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde de la photo de projet' });
    }

    // Sync to dist if available
    try {
      const distUploadPath = path.join(process.cwd(), 'dist', 'uploads', filename);
      fs.copyFileSync(uploadFilePath, distUploadPath);
    } catch (e) {
      // Ignored if dist not built yet
    }

    const siteData = loadSiteData();
    const photoUrl = `/uploads/${filename}?v=${timestamp}`;
    siteData.projectPhotos[projectId] = photoUrl;
    saveSiteData(siteData);

    console.log(`[Media] Project photo for "${projectId}" updated`);

    return res.json({
      success: true,
      projectId,
      photoUrl,
    });
  });

  // Update shared Google Drive link
  app.post('/api/media/drive-url', (req, res) => {
    const { driveUrl } = req.body;
    const siteData = loadSiteData();
    siteData.driveUrl = driveUrl || null;
    saveSiteData(siteData);
    return res.json({ success: true, driveUrl: siteData.driveUrl });
  });

  // Reset profile photo to original default
  app.post('/api/media/reset-profile', (req, res) => {
    const siteData = loadSiteData();
    siteData.profilePhoto = null;
    delete siteData.profilePhotoTimestamp;
    saveSiteData(siteData);
    return res.json({ success: true });
  });

  // Reset project photo
  app.post('/api/media/reset-project', (req, res) => {
    const { projectId } = req.body;
    const siteData = loadSiteData();
    if (siteData.projectPhotos && siteData.projectPhotos[projectId]) {
      delete siteData.projectPhotos[projectId];
      saveSiteData(siteData);
    }
    return res.json({ success: true });
  });

  // --- Vite Dev or Static Production Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Portfolio running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Failed to start server:', err);
  process.exit(1);
});
