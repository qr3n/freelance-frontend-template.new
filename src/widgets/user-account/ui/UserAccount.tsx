'use client';

import { useState } from 'react';
import { SessionList } from '@/entities/session/ui/SessionList';
import { UserProfile } from '@/entities/user/ui/UserProfile';
import type { Session } from '@/entities/session/model/types';
import { useDeleteSession } from '@/features/session/delete/model/hooks';
import { User } from '@/entities/auth/model/types';

interface UserAccountWidgetProps {
  user: User;
  sessions: Session[];
  currentSessionId?: string;
}

export function UserAccountWidget({ user, sessions, currentSessionId }: UserAccountWidgetProps) {
  const { mutate: deleteSession } = useDeleteSession();
  const [deletingSessionId, setDeletingSessionId] = useState<string>();

  const handleDeleteSession = (sessionId: string) => {
    setDeletingSessionId(sessionId);
    deleteSession(sessionId, {
      onSettled: () => {
        setDeletingSessionId(undefined);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мой аккаунт</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управляйте своим профилем и активными сессиями
          </p>
        </div>
      </div>

      <UserProfile user={user} />

      <div className="bg-white rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Активные сессии</h2>
          <p className="text-sm text-gray-500 mt-1">
            Всего активных сессий: {sessions.length}
          </p>
        </div>

        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onDeleteSession={handleDeleteSession}
          deletingSessionId={deletingSessionId}
        />
      </div>
    </div>
  );
}