import { Logger } from "../services/logger.service";
import { UserTypeClient } from "../types/user.type";
import { getActiveUserId } from "./localstorage.utils";

const DB_NAME = 'multiSessionDB';
const STORE_NAME = 'sessions';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(STORE_NAME, { keyPath: 'userId' });
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error(request.error?.message ?? 'Unknown error occurred'));
  });
}

export async function saveSession(userId: string, userData: UserTypeClient): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ userId, ...userData });
  
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(request.error?.message ?? 'Unknown error occurred'));
    });
}

export async function deleteSession(userId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(userId);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(request.error?.message ?? 'Unknown error occurred'));
    });
}

export async function deleteAllSessions(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(request.error?.message ?? 'Unknown error occurred'));
    });
}

export async function deleteActiveSession(): Promise<void> {
    const userId = getActiveUserId();
    if (!userId) return;

    return deleteSession(userId);
}

export async function getSession(userId: string): Promise<UserTypeClient | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(userId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error(request.error?.message ?? 'Unknown error occurred'));
    });
}

export async function getAllSessions(): Promise<UserTypeClient[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error(request.error?.message ?? 'Unknown error occurred'));
    });
}

export async function getActiveSession(): Promise<UserTypeClient | undefined> {
    const userId = getActiveUserId();
    if (!userId) return undefined;

    return getSession(userId);
}
