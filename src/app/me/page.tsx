import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserAccountWidget } from '@/widgets/user-account/ui/UserAccount';
import { getCurrentUser, getUserSessions } from '@/entities/session/model/api';
import { User } from '@/entities/auth/model/types';
import { Session } from 'node:inspector';

export const metadata = {
  title: 'Мой аккаунт',
  description: 'Информация об аккаунте и управление сессиями',
};

const testUser: User = {
  id: 'tejasdkasjdkahjds',
  email: 'qtter85@gmail.com',
  is_active: true,
  is_verified: true,
  created_at: '124'
}

const testSessions: Session[] = [

]

export default async function MePage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id');
  //
  // if (!sessionId) {
  //   redirect('/login');
  // }

  try {
    // const [user, sessions] = await Promise.all([
    //   getCurrentUser(),
    //   getUserSessions(),
    // ]);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <UserAccountWidget
          user={testUser}
          sessions={testSessions}
          currentSessionId={sessionId.value}
        />
      </div>
    );
  } catch (error) {
    // redirect('/login');
  }
}