import './index.scss';
import { useEffect, useRef } from 'react';
import { useGame } from '../../context/Game';

export const ActivityLog = () => {
  const { activityLog, removeActivityLogEntry, clearActivityLog } = useGame();
  const scheduled = useRef<Set<string>>(new Set());

  useEffect(() => {
    activityLog.forEach((entry, index) => {
      if (!scheduled.current.has(entry.id)) {
        scheduled.current.add(entry.id);

        setTimeout(
          () => {
            removeActivityLogEntry(entry.id);
            scheduled.current.delete(entry.id); // clean up after removal
          },
          10000 + index * 500
        ); // 10s base, slight delay per item
      }
    });
  }, [activityLog, removeActivityLogEntry]);

  return (
    <div className="activity-log">
      <h3>Activity Log</h3>
      <div>
        <ul>
          {activityLog.map((entry, index) => (
            <li
              key={entry.id}
              className={`log-entry ${entry.type}`}
              style={{ animationDelay: `${10 + index * 0.5}s` }}
            >
              {entry.message}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={clearActivityLog}>Clear</button>
    </div>
  );
};
