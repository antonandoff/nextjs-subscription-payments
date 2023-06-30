import {
  getSession,
  getServers,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';


import Form from './Form'



export default async function Servers() {
  const [session, servers] = await Promise.all([
    getSession(),
    getServers()
  ]);

  
  if (!session) {
    return redirect('/signin');
  }

  const addPlanToServer = async (data:any) => {
    'use server'
    console.log(data)
  }

  const removePlanFromServer = async (data:any) => {    
    'use server'
    console.log(data)
  }

  return (<> 
    <h1 className='text-2xl font-extrabold sm:text-center sm:text-2xl mb-10 text-black dark:text-white'>Add server form</h1>  
      <Form />
    </>
  );
}
