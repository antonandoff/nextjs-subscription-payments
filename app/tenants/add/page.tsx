import {
  getSession,
  getServers,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';

export default async function Servers() {
  const [session, servers] = await Promise.all([
    getSession(),
    getServers()
  ]);

  
  if (!session) {
    return redirect('/signin');
  }

  return (        
    <h1>Add tenant page</h1>     
  );
}
