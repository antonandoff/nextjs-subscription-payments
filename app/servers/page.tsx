import ServersList from './ServerList';
import { getSession, getServers } from '@/app/supabase-server';
import { redirect } from 'next/navigation';

export default async function Servers() {
  const [session, servers] = await Promise.all([getSession(), getServers()]);

  if (!session) {
    return redirect('/signin');
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <ServersList servers={servers} />
      </div>
    </div>
  );
}
