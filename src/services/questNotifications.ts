const STORAGE_KEY = 'QUEST_NOTIFICATIONS_ENABLED';

const fallbackTimers = new Map<string, ReturnType<typeof setTimeout>>();

let cachedEnabled: boolean | undefined;

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export function getNotificationsEnabled(): boolean {
  if (cachedEnabled !== undefined) return cachedEnabled;
  if (!isNotificationSupported()) {
    cachedEnabled = false;
    return false;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  cachedEnabled = stored === 'true';
  return cachedEnabled;
}

export function saveNotificationsEnabled(value: boolean) {
  cachedEnabled = value;
  localStorage.setItem(STORAGE_KEY, String(value));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

async function postToServiceWorker(message: Record<string, unknown>): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg?.active) {
      reg.active.postMessage(message);
      return true;
    }
  } catch {
    // SW unavailable
  }
  return false;
}

export async function scheduleQuestNotification(
  questId: string,
  questName: string,
  endsAtSeconds: number
) {
  cancelQuestNotification(questId);

  const endsAtMs = endsAtSeconds * 1000;
  const delayMs = endsAtMs - Date.now();

  if (delayMs <= 0) return;

  const sentToSW = await postToServiceWorker({
    type: 'SCHEDULE_QUEST_NOTIFICATION',
    questId,
    questName,
    endsAtMs,
  });

  if (sentToSW) return;

  const timer = setTimeout(() => {
    fallbackTimers.delete(questId);
    if (Notification.permission !== 'granted') return;
    new Notification('Quest Complete!', {
      body: `${questName} has finished.`,
      icon: '/BionicleIdleRPG/pwa-192x192.png',
      tag: `quest-${questId}`,
    });
  }, delayMs);

  fallbackTimers.set(questId, timer);
}

export function cancelQuestNotification(questId: string) {
  const timer = fallbackTimers.get(questId);
  if (timer) {
    clearTimeout(timer);
    fallbackTimers.delete(questId);
  }

  postToServiceWorker({ type: 'CANCEL_QUEST_NOTIFICATION', questId });
}

export function cancelAllQuestNotifications() {
  for (const timer of fallbackTimers.values()) {
    clearTimeout(timer);
  }
  fallbackTimers.clear();

  postToServiceWorker({ type: 'CANCEL_ALL_QUEST_NOTIFICATIONS' });
}
