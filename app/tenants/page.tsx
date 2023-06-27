import {
  getSession,
  getTenants
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';

export default async function Subscriptions() {
  const [session, tenants] = await Promise.all([
    getSession(),
    getTenants()
  ]);

  const user = session?.user;
  if (!session) {
    return redirect('/signin');
  }


  return (
    <section className="mb-32 dark:bg-black bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Tenants 
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Headers
          </p>

          <div className="px-4 sm:px-6 lg:px-8">
  <div className="sm:flex sm:items-center">
    <div className="sm:flex-auto">
      <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
      <p className="mt-2 text-sm text-gray-700">A list of all the users in your account including their name, title, email and role.</p>
    </div>
    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button type="button" className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add user</button>
    </div>
  </div>
  <div className="mt-8 flow-root">
    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">Name</th>
              <th scope="col" className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">Title</th>
              <th scope="col" className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">Email</th>
              <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Role</th>
              <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">Lindsay Walton</td>
              <td className="whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">Front-end Developer</td>
              <td className="whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">lindsay.walton@example.com</td>
              <td className="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">Member</td>
              <td className="relative whitespace-nowrap border-b border-gray-200 py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit<span className="sr-only">, Lindsay Walton</span></a>
              </td>
            </tr>

            {/* <!-- More people... --> */}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>


          {tenants && tenants.map((data:any, index:any)=>
            <>
              <p>{data.id}</p>
            </>
          )}
        </div>
      </div>
     
    </section>
  );
}
