import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MdDevices, MdAccessTime, MdCalendarToday } from 'react-icons/md';
import type { Session } from '../model/types';

interface SessionCardProps {
  session: Session;
  isCurrent?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function SessionCard({ session, isCurrent, onDelete, isDeleting }: SessionCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <MdDevices className="text-gray-400 flex-shrink-0" size={20} />
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {session.user_agent || 'Неизвестное устройство'}
            </h3>
            {isCurrent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Текущая
              </span>
            )}
          </div>

          <dl className="space-y-1">
            {session.ip_address && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="font-medium">IP:</span>
                <span className="font-mono">{session.ip_address}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MdCalendarToday size={14} className="flex-shrink-0" />
              <span>
                Создана {formatDistanceToNow(new Date(session.created_at), { addSuffix: true, locale: ru })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MdAccessTime size={14} className="flex-shrink-0" />
              <span>
                Активность {formatDistanceToNow(new Date(session.last_activity), { addSuffix: true, locale: ru })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="font-medium">Истекает:</span>
              <span>
                {formatDistanceToNow(new Date(session.expires_at), { addSuffix: true, locale: ru })}
              </span>
            </div>
          </dl>
        </div>

        {!isCurrent && onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="ml-4 px-3 py-1.5 text-xs font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        )}
      </div>
    </div>
  );
}