'use client';

import TableEntry from './TableEntry';

interface Props {
  servers: any | null;
}

export default function ServersList({ servers }: Props) {
  return (
    <section className="mb-32 dark:bg-black bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white dark:bg-black shadow dark:border dark:border-white">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:align-center sm:flex sm:flex-col">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      Servers
                    </h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-white">
                      A list of all the servers in your account including their
                      name, title, email and role.
                    </p>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      type="button"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add server
                    </button>
                  </div>
                </div>
                <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                      <table className="min-w-full border-separate border-spacing-0">
                        <thead className="">
                          <tr className="">
                            <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                              Name
                            </th>
                            <th className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                              Tenants
                            </th>
                            <th className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">
                              Capacity
                            </th>
                            <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                              Status
                            </th>
                            <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {servers &&
                            servers.map((data: any, index: any) => (
                              <TableEntry key={index} data={data} />
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
