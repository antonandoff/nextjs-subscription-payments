import Set from '../Set';
import List from './List';
import {
  getSession,
  getServers,
  getServerRecordWithTenants
} from '@/app/supabase-server';
import Plan from '@/components/plan/Plan';
import { redirect } from 'next/navigation';

export default async function Servers() {
  const [session, servers] = await Promise.all([
    getSession(),
    getServerRecordWithTenants()
  ]);

  if (!session) {
    return redirect('/signin');
  }

  return (
    <div className="text-black dark:text-white">
      {/* <h1 >Add tenant page</h1>      */}
      {servers &&
        servers.map((server: any, index: any) => {
        const isLastItem = index === servers.length - 1;
        return (
          <div key={index} className="">
            <div>
              <h2 className="text-xl">{server.details.name}</h2>
              <h3 className="mt-5 mb-10">{server.details.info}</h3>

              <div className="grid gap-6 mb-6 md:grid-cols-3">
                {server.plans &&
                  server.plans.map((plan: any, index: any) => {     
                  return (
                    <>
                      <Plan data={plan} server={server} mode={'user'}/>
                    </>
                  )})}
              </div>
            </div>

            {!isLastItem && <div className="relative mt-10 mb-20 ml-[-100px] mr-[-100px]">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>}
          </div>
        )})}
    </div>
  );
}
