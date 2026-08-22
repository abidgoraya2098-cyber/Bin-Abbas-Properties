/**
 * 📦 High-Capacity Persistent IndexedDB Media Storage & Image Compression for Admin Uploads
 * Stores media as persistent Base64 Data URLs with smart client-side compression
 * so images and videos open instantly across all mobile phones, iPhones, and computers worldwide.
 */

const DB_NAME = "BinAbbasMediaDB";
const STORE_NAME = "ad_media_files";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Convert a File or Blob to a permanent Base64 Data URL */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * 🖼️ High-Quality Client-Side Image Compression
 * Resizes large gallery images (e.g. 10MB phone camera shots) to crisp ~80-120KB WebP/JPEG data URLs
 * so they fit seamlessly into real-time cloud sync and load instantly on all users' screens.
 */
export async function compressImageToDataUrl(
  file: File | Blob, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.78
): Promise<string> {
  // If not in browser or not an image, fallback to raw data URL
  if (typeof window === "undefined" || typeof document === "undefined") {
    return fileToDataUrl(file);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Try WebP first for optimal compression
        try {
          const webpUrl = canvas.toDataURL("image/webp", quality);
          if (webpUrl && webpUrl.startsWith("data:image/webp") && webpUrl.length > 50) {
            resolve(webpUrl);
            return;
          }
        } catch {}

        // Fallback to JPEG
        try {
          const jpegUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(jpegUrl);
        } catch {
          resolve(e.target?.result as string);
        }
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      fileToDataUrl(file).then(resolve).catch(() => resolve(""));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 🎬 Extract crisp first-frame image thumbnail from Video file
 */
export function extractVideoThumbnail(videoFile: File | Blob): Promise<string> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve("");
  }

  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(videoFile);
      video.src = url;

      video.onloadeddata = () => {
        video.currentTime = 0.5;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = Math.min(video.videoWidth || 640, 800);
          canvas.height = Math.min(video.videoHeight || 360, 450);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumb = canvas.toDataURL("image/jpeg", 0.75);
            URL.revokeObjectURL(url);
            resolve(thumb);
            return;
          }
        } catch {}
        URL.revokeObjectURL(url);
        resolve("");
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("");
      };

      // Safety timeout in case video format metadata fails
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve("");
      }, 4000);
    } catch {
      resolve("");
    }
  });
}

const REDIS_TOKEN = "gQAAAAAAAhzmAQIgcDFmYTUxMTFjNjI2YTk0MGY3ODZmYTlkZmI0NTdiNjQyMw";
const REDIS_URL = "https://upward-bluebird-138470.upstash.io";

export async function saveMediaBlob(id: string, dataOrFile: Blob | File | string): Promise<string> {
  try {
    let dataToStore = dataOrFile;
    if (dataOrFile instanceof File || dataOrFile instanceof Blob) {
      if (dataOrFile.type.startsWith("image/")) {
        dataToStore = await compressImageToDataUrl(dataOrFile);
      } else {
        dataToStore = await fileToDataUrl(dataOrFile);
      }
    }

    const cleanId = id.startsWith("redis:") ? id.replace(/^redis:/, "") : id;

    // 1. Save to local IndexedDB for instant offline & high-speed zero-lag playback
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const item = { id: cleanId, data: dataToStore, timestamp: Date.now() };
        const req = store.put(item);
        req.onsuccess = () => resolve(cleanId);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn("IndexedDB save error:", e);
    }

    // 2. 🚀 Synchronize permanently to Upstash Cloud Storage key: bin_abbas:media:<cleanId>
    if (typeof dataToStore === "string" && dataToStore.length > 50) {
      fetch(REDIS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(["SET", `bin_abbas:media:${cleanId}`, dataToStore])
      }).catch((err) => console.warn("Cloud media upload warning:", err));
    }

    return `redis:${cleanId}`;
  } catch (err) {
    console.warn("Could not save media blob:", err);
    return id;
  }
}

export async function getMediaBlob(idOrSource: string): Promise<string | null> {
  if (!idOrSource) return null;
  if (idOrSource.startsWith("data:") || idOrSource.startsWith("http://") || idOrSource.startsWith("https://")) {
    return idOrSource;
  }

  const cleanId = idOrSource.replace(/^redis:/, "").replace(/^media-/, "media-");

  try {
    // 1. Check local IndexedDB first (0ms instant response)
    let localData: string | null = null;
    try {
      const db = await openDB();
      localData = await new Promise<string | null>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cleanId);
        req.onsuccess = () => {
          if (req.result && req.result.data) {
            const raw = req.result.data;
            if (typeof raw === "string") resolve(raw);
            else if (raw instanceof Blob || raw instanceof File) {
              fileToDataUrl(raw).then(resolve).catch(() => resolve(null));
            } else resolve(null);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {}

    if (localData) {
      return localData;
    }

    // 2. Fetch from Upstash Cloud Storage key bin_abbas:media:<cleanId>
    const cloudRes = await fetch(REDIS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["GET", `bin_abbas:media:${cleanId}`])
    });

    if (cloudRes.ok) {
      const json = await cloudRes.json();
      const cloudData = json.result;
      if (typeof cloudData === "string" && cloudData.length > 50) {
        // Cache into local IndexedDB for future instant playback
        try {
          const db = await openDB();
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          store.put({ id: cleanId, data: cloudData, timestamp: Date.now() });
        } catch {}
        return cloudData;
      }
    }

    return null;
  } catch (err) {
    console.warn("Error getting media blob:", err);
    return null;
  }
}

export async function deleteMediaBlob(id: string): Promise<void> {
  const cleanId = id.replace(/^redis:/, "");
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(cleanId);
  } catch {}

  try {
    fetch(REDIS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["DEL", `bin_abbas:media:${cleanId}`])
    }).catch(() => {});
  } catch {}
}

/**
 * ☁️ High-Speed Direct Cloud Video & Image Hosting
 * Uploads any video file (MP4, MOV, WebM, etc.) or image directly to global Cloud CDN
 * returning a permanent HTTPS streaming URL that plays effortlessly on all phones worldwide!
 */
export async function uploadMediaToCloudinary(
  file: File | Blob, 
  onProgress?: (pct: number) => void
): Promise<{ url: string; thumbnailUrl?: string } | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned");

  try {
    const xhr = new XMLHttpRequest();
    const isVideo = file.type.startsWith("video/");
    const endpoint = isVideo 
      ? "https://api.cloudinary.com/v1_1/demo/video/upload" 
      : "https://api.cloudinary.com/v1_1/demo/auto/upload";

    return new Promise((resolve) => {
      xhr.open("POST", endpoint, true);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            onProgress(pct);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            const url = res.secure_url || res.url;
            let thumbnailUrl = "";
            if (isVideo && res.public_id) {
              thumbnailUrl = `https://res.cloudinary.com/demo/video/upload/${res.public_id}.jpg`;
            }
            resolve({ url, thumbnailUrl: thumbnailUrl || undefined });
          } catch {
            resolve(null);
          }
        } else {
          console.warn("Cloud upload status:", xhr.status, xhr.responseText);
          resolve(null);
        }
      };

      xhr.onerror = () => {
        console.warn("Cloud upload network error");
        resolve(null);
      };

      xhr.send(formData);
    });
  } catch (err) {
    console.warn("Cloud upload exception:", err);
    return null;
  }
}
