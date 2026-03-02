const STORAGE_KEY = 'QUEST_NOTIFICATIONS_ENABLED';

const scheduledTimers = new Map<string, ReturnType<typeof setTimeout>>();

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

async function showNotification(questName: string, questId: string) {
  const title = 'Quest Complete!';
  const options: NotificationOptions = {
    body: `${questName} has finished.`,
    icon: '/BionicleIdleRPG/pwa-192x192.png',
    tag: `quest-${questId}`,
  };

  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      reg.showNotification(title, options);
      return;
    }
  } catch {
    // SW unavailable, fall through
  }

  new Notification(title, options);
}

export function scheduleQuestNotification(
  questId: string,
  questName: string,
  endsAtSeconds: number
) {
  cancelQuestNotification(questId);

  const now = Math.floor(Date.now() / 1000);
  const delayMs = (endsAtSeconds - now) * 1000;

  if (delayMs <= 0) return;

  const timer = setTimeout(() => {
    scheduledTimers.delete(questId);

    if (Notification.permission !== 'granted') return;

    showNotification(questName, questId);
  }, delayMs);

  scheduledTimers.set(questId, timer);
}

export function cancelQuestNotification(questId: string) {
  const timer = scheduledTimers.get(questId);
  if (timer) {
    clearTimeout(timer);
    scheduledTimers.delete(questId);
  }
}

export function cancelAllQuestNotifications() {
  for (const timer of scheduledTimers.values()) {
    clearTimeout(timer);
  }
  scheduledTimers.clear();
}
