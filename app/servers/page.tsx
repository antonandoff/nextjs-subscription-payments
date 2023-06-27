import {
  getSession,
  getServers,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import ServersList from './ServerList';

export default async function Servers() {
  const [session, servers] = await Promise.all([
    getSession(),
    getServers()
  ]);

  
  if (!session) {
    return redirect('/signin');
  }

  return (        
    <ServersList servers={servers}/>      
  );
}
