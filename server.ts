import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// High capacity payload limit for Base64 photos & videos
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Global CORS headers middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Storage Directory Setup (Compatible with Vercel /tmp and Local Server)
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn("Could not create data dir:", e);
  }
}

const ADS_FILE = path.join(DATA_DIR, "ads.json");
const DEVICES_FILE = path.join(DATA_DIR, "devices.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

// Helper file read/write functions
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`Error writing ${filePath}:`, err);
  }
}

// ==========================================
// 🌟 1. GLOBAL PROMO ADS API (SYNCED WORLDWIDE)
// ==========================================

// GET /api/ads - Returns all active promo ads for all users
app.get("/api/ads", (req, res) => {
  try {
    const ads = readJsonFile<any[]>(ADS_FILE, []);
    res.json(ads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ads - Admin creates or updates an ad (Broadcasts globally)
app.post("/api/ads", (req, res) => {
  try {
    const newAd = req.body;
    if (!newAd || !newAd.id) {
      return res.status(400).json({ error: "Invalid ad data" });
    }

    const ads = readJsonFile<any[]>(ADS_FILE, []);
    const existingIndex = ads.findIndex((a) => a.id === newAd.id);

    if (existingIndex >= 0) {
      ads[existingIndex] = { ...ads[existingIndex], ...newAd };
    } else {
      ads.unshift(newAd);
    }

    writeJsonFile(ADS_FILE, ads);
    res.json({ success: true, ad: newAd, totalAds: ads.length });
  } catch (error: any) {
    console.error("Error saving ad:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/ads/:id - Admin deletes an ad globally
app.delete("/api/ads/:id", (req, res) => {
  try {
    const { id } = req.params;
    let ads = readJsonFile<any[]>(ADS_FILE, []);
    ads = ads.filter((a) => a.id !== id);
    writeJsonFile(ADS_FILE, ads);
    res.json({ success: true, message: `Ad ${id} deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 📱 2. INSTALLED DEVICES & USERS TRACKER API
// ==========================================

// Parse User Agent details
function parseDeviceInfo(uaString: string, ipString: string) {
  const lower = uaString.toLowerCase();
  let deviceType = "PC";
  let os = "Windows";
  let deviceModel = "Desktop PC";

  if (/iphone|ipod/.test(lower)) {
    deviceType = "iPhone";
    os = "iOS";
    deviceModel = "Apple iPhone";
  } else if (/ipad/.test(lower)) {
    deviceType = "Tablet";
    os = "iPadOS";
    deviceModel = "Apple iPad";
  } else if (/android/.test(lower)) {
    deviceType = "Android";
    os = "Android";
    const match = uaString.match(/Android\s+([\d.]+);\s*([^;)]+)/);
    deviceModel = match && match[2] ? match[2].trim() : "Android Phone";
  } else if (/macintosh|mac os x/.test(lower)) {
    deviceType = "Mac";
    os = "macOS";
    deviceModel = "Apple Mac";
  } else if (/linux/.test(lower)) {
    deviceType = "PC";
    os = "Linux";
    deviceModel = "Linux PC";
  }

  return { deviceType, os, deviceModel };
}

// POST /api/devices/register - Log every app installation & active session
app.post("/api/devices/register", (req, res) => {
  try {
    const { id, deviceType, deviceModel, os, browser, isPwaInstalled, installDate } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Device ID required" });
    }

    let clientIp = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();
    if (clientIp === "::1" || clientIp === "::ffff:127.0.0.1") {
      clientIp = "127.0.0.1";
    }

    const ua = req.headers["user-agent"] || "";
    const parsed = parseDeviceInfo(ua, clientIp);

    const devices = readJsonFile<any[]>(DEVICES_FILE, []);
    const existingIndex = devices.findIndex((d) => d.id === id);
    const now = Date.now();

    const deviceRecord = {
      id,
      deviceType: deviceType || parsed.deviceType,
      deviceModel: deviceModel || parsed.deviceModel,
      os: os || parsed.os,
      browser: browser || "Web Browser",
      isPwaInstalled: !!isPwaInstalled,
      installDate: installDate || (existingIndex >= 0 ? devices[existingIndex].installDate : now),
      installDateFormatted: new Date(installDate || now).toLocaleDateString("ur-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      lastActive: now,
      lastActiveFormatted: new Date(now).toLocaleDateString("ur-PK", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      ip: clientIp,
      isOnline: true
    };

    if (existingIndex >= 0) {
      devices[existingIndex] = { ...devices[existingIndex], ...deviceRecord };
    } else {
      devices.unshift(deviceRecord);
    }

    // Keep top 1000 devices
    writeJsonFile(DEVICES_FILE, devices.slice(0, 1000));

    res.json({ success: true, totalDevices: devices.length, device: deviceRecord });
  } catch (error: any) {
    console.error("Error registering device:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/devices - Admin fetches all registered devices & stats
app.get("/api/devices", (req, res) => {
  try {
    const devices = readJsonFile<any[]>(DEVICES_FILE, []);
    const now = Date.now();

    // Mark online if active in last 5 minutes
    const enriched = devices.map((d) => ({
      ...d,
      isOnline: now - Number(d.lastActive || 0) < 5 * 60 * 1000
    }));

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 📩 3. CUSTOMER INQUIRIES & LEADS API
// ==========================================

// GET /api/inquiries
app.get("/api/inquiries", (req, res) => {
  try {
    const inquiries = readJsonFile<any[]>(INQUIRIES_FILE, []);
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/inquiries - Customer submits buy/sell lead
app.post("/api/inquiries", (req, res) => {
  try {
    const newInquiry = req.body;
    if (!newInquiry || !newInquiry.id) {
      return res.status(400).json({ error: "Invalid inquiry data" });
    }

    const inquiries = readJsonFile<any[]>(INQUIRIES_FILE, []);
    inquiries.unshift(newInquiry);
    writeJsonFile(INQUIRIES_FILE, inquiries);

    res.json({ success: true, inquiry: newInquiry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🚀 4. STATIC ASSETS & VITE DEV SERVER
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");

    // Serve HTML with NO CACHE headers so all users immediately get the latest updates
    app.get(["/", "/index.html"], (req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });

    app.get(["/manifest.json", "/manifest.webmanifest"], (req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const pwaManifest = path.join(distPath, "manifest.webmanifest");
      const legacyManifest = path.join(distPath, "manifest.json");
      if (fs.existsSync(pwaManifest)) {
        res.sendFile(pwaManifest);
      } else {
        res.sendFile(legacyManifest);
      }
    });

    app.use(express.static(distPath, {
      maxAge: "30d",
      setHeaders: (res, filePath) => {
        if (
          filePath.endsWith(".html") ||
          filePath.endsWith("manifest.json") ||
          filePath.endsWith("sw.js")
        ) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else {
          res.setHeader("Cache-Control", "public, max-age=2592000");
        }
      }
    }));

    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Bin Abbas Properties Real Estate Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
