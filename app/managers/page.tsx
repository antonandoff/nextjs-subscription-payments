import {
  getSession,
  getAccountManagers
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';

export default async function Subscriptions() {
  const [session, managers] = await Promise.all([
    getSession(),
    getAccountManagers()
  ]);

  const user = session?.user;
  if (!session) {
    return redirect('/signin');
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Managers 
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Header 2
          </p>

          {managers && managers.map((data:any, index:any)=>
            <>
              <p>{data.id}</p>
            </>
          )}
        </div>
      </div>
     
    </section>
  );
}
