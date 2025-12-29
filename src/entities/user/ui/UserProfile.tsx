import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { User } from '@/entities/auth/model/types';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Профиль</h2>
          <p className="text-sm text-gray-500 mt-1">
            Создан {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ru })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user.is_verified && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Верифицирован
            </span>
          )}
          {user.is_active ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Активен
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Неактивен
            </span>
          )}
        </div>
      </div>

      <dl className="mt-6 space-y-4">
        {user.username && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Имя пользователя</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
          </div>
        )}

        {user.email && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
        )}

        {user.phone && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Телефон</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.phone}</dd>
          </div>
        )}

        <div>
          <dt className="text-sm font-medium text-gray-500">ID</dt>
          <dd className="mt-1 text-sm font-mono text-gray-900">{user.id}</dd>
        </div>
      </dl>
    </div>
  );
}