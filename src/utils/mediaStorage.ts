/**
 * 📦 High-Capacity Persistent IndexedDB Media Storage for Admin Gallery Uploads
 * Stores media as persistent Base64 Data URLs and Blobs for reliable playback across all devices & reloads.
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

export async function saveMediaBlob(id: string, dataOrFile: Blob | File | string): Promise<string> {
  try {
    let dataToStore = dataOrFile;
    if (dataOrFile instanceof File || dataOrFile instanceof Blob) {
      dataToStore = await fileToDataUrl(dataOrFile);
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      
      const item = { id, data: dataToStore, timestamp: Date.now() };
      const req = store.put(item);

      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Could not save to IndexedDB:", err);
    return id;
  }
}

export async function getMediaBlob(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result && req.result.data) {
          const raw = req.result.data;
          if (typeof raw === "string") {
            resolve(raw);
          } else if (raw instanceof Blob || raw instanceof File) {
            fileToDataUrl(raw).then(resolve).catch(() => resolve(null));
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteMediaBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Graceful fallback
  }
}
