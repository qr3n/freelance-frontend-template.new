import { SessionCard } from './SessionCard';
import type { Session } from '../model/types';

interface SessionListProps {
  sessions: Session[];
  currentSessionId?: string;
  onDeleteSession?: (sessionId: string) => void;
  deletingSessionId?: string;
}

export function SessionList({
                              sessions,
                              currentSessionId,
                              onDeleteSession,
                              deletingSessionId
                            }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Активных сессий не найдено
      </div>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.id === currentSessionId) return -1;
    if (b.id === currentSessionId) return 1;
    return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isCurrent={session.id === currentSessionId}
          onDelete={onDeleteSession ? () => onDeleteSession(session.id) : undefined}
          isDeleting={deletingSessionId === session.id}
        />
      ))}
    </div>
  );
}