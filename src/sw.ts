/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ---------------------------------------------------------------------------
// IndexedDB helpers for persisting notification schedules across SW restarts
// ---------------------------------------------------------------------------

interface ScheduledQuest {
  questId: string;
  questName: string;
  endsAtMs: number;
}

const DB_NAME = 'quest-notifications';
const STORE_NAME = 'scheduled';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME, { keyPath: 'questId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(quest: ScheduledQuest): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(quest);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function idbDelete(questId: string): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(questId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function idbClear(): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function idbGetAll(): Promise<ScheduledQuest[]> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

// ---------------------------------------------------------------------------
// In-memory timers (lost on SW termination, rebuilt from IDB on next start)
// ---------------------------------------------------------------------------

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

function showQuestNotification(quest: ScheduledQuest) {
  self.registration.showNotification('Quest Complete!', {
    body: `${quest.questName} has finished.`,
    icon: '/BionicleIdleRPG/pwa-192x192.png',
    tag: `quest-${quest.questId}`,
  });
}

function scheduleTimer(quest: ScheduledQuest) {
  const existing = activeTimers.get(quest.questId);
  if (existing) clearTimeout(existing);

  const delay = quest.endsAtMs - Date.now();

  if (delay <= 0) {
    showQuestNotification(quest);
    idbDelete(quest.questId);
    return;
  }

  const timer = setTimeout(() => {
    activeTimers.delete(quest.questId);
    showQuestNotification(quest);
    idbDelete(quest.questId);
  }, delay);

  activeTimers.set(quest.questId, timer);
}

function restoreTimersFromIDB(): Promise<void> {
  return idbGetAll().then((quests) => {
    for (const quest of quests) {
      scheduleTimer(quest);
    }
  });
}

// Restore timers whenever the SW process starts (covers restarts after
// the browser terminated the process to reclaim resources).
restoreTimersFromIDB().catch(() => {});

// ---------------------------------------------------------------------------
// Message handler – main thread posts schedule/cancel commands here
// ---------------------------------------------------------------------------

self.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;
  const { type } = event.data;

  if (type === 'SCHEDULE_QUEST_NOTIFICATION') {
    const { questId, questName, endsAtMs } = event.data as {
      questId: string;
      questName: string;
      endsAtMs: number;
    };
    const quest: ScheduledQuest = { questId, questName, endsAtMs };
    event.waitUntil(idbPut(quest).then(() => scheduleTimer(quest)));
  } else if (type === 'CANCEL_QUEST_NOTIFICATION') {
    const { questId } = event.data as { questId: string };
    const timer = activeTimers.get(questId);
    if (timer) {
      clearTimeout(timer);
      activeTimers.delete(questId);
    }
    event.waitUntil(idbDelete(questId));
  } else if (type === 'CANCEL_ALL_QUEST_NOTIFICATIONS') {
    for (const timer of activeTimers.values()) clearTimeout(timer);
    activeTimers.clear();
    event.waitUntil(idbClear());
  }
});

// ---------------------------------------------------------------------------
// Activate – also restore timers (covers first install / SW updates)
// ---------------------------------------------------------------------------

self.addEventListener('activate', (event) => {
  event.waitUntil(restoreTimersFromIDB());
});

// ---------------------------------------------------------------------------
// Notification click – focus or open the app
// ---------------------------------------------------------------------------

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow('/BionicleIdleRPG/');
    })
  );
});
