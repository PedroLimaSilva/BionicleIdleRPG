import { useEffect, useRef } from 'react';
import { QuestProgress } from '../types/Quests';
import { QUESTS } from '../data/quests';
import {
  isNotificationSupported,
  scheduleQuestNotification,
  cancelQuestNotification,
  cancelAllQuestNotifications,
  getNotificationsEnabled,
} from '../services/questNotifications';

export function useQuestNotifications(activeQuests: QuestProgress[]) {
  const prevQuestIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (
      !isNotificationSupported() ||
      !getNotificationsEnabled() ||
      Notification.permission !== 'granted'
    ) {
      return;
    }

    const currentIds = new Set(activeQuests.map((q) => q.questId));
    const prevIds = prevQuestIdsRef.current;

    for (const quest of activeQuests) {
      if (!prevIds.has(quest.questId)) {
        const questData = QUESTS.find((q) => q.id === quest.questId);
        if (questData) {
          scheduleQuestNotification(quest.questId, questData.name, quest.endsAt);
        }
      }
    }

    for (const id of prevIds) {
      if (!currentIds.has(id)) {
        cancelQuestNotification(id);
      }
    }

    prevQuestIdsRef.current = currentIds;
  }, [activeQuests]);

  useEffect(() => {
    return () => cancelAllQuestNotifications();
  }, []);
}
