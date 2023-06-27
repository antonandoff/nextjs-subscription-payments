import {
  getSession,
  getServers,
  getUserDetails,
  createServerRecord
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
// import { useState } from 'react';
import ServersForm from './ServerForm';
import ServersList from './ServerList';

export default async function Servers() {
  const [session, servers] = await Promise.all([
    getSession(),
    getServers()
  ]);
  // const [tabPage, setTabPage] = useState('list')

  const userDetails = await getUserDetails(session?.user.id)
  const user = session?.user;
  if (!session) {
    return redirect('/signin');
  }

  const handleServerCreation = async (e: any) => {

    e.preventDefault();
    const data = {
      created_by: session?.user?.id,
      location: e.target.location.value,
      version: e.target.version.value,
      details: {
        name: e.target.name.value,
        avatar: e.target.avatar.value,
        info: e.target.info.value
      },
      capacity: e.target.capacity.value,
      url: e.target.url.value,
      credentials: {
        username: e.target.admin.value,
        password: e.target.admin_pass.value
      }
    }
    // Send the data to the server in JSON format.
    // const JSONdata = JSON.stringify(data)

    const x =  await createServerRecord(data);
  }

  return (
    <section className="mb-32 dark:bg-black bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Servers 
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Header 2
          </p>

          {servers && servers.map((data:any, index:any)=>
            <>
              <p>{data.id}</p>
            </>
          )}
          
          <ServersList servers={servers}/>
          <ServersForm userDetails={userDetails}/>
        </div>
      </div>
     
    </section>
  );
}
