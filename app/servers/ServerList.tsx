'use client';

import Link from 'next/link';

interface Props {
    servers: any | null
}

export default function ServersList({servers}:Props) {
 
  return (<section>
    {/* <h4>Servers</h4>    */}
          <div> 
          {/* <h3 className='ml-5 font-bold text-gray-500 mt-10'>Servers list</h3> */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg mr-10 mb-10 text-sm text-gray-900 bg-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500">
              {/* <div className="flex justify-between items-center py-4 bg-white dark:bg-gray-800">
                
              </div> */}
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          {/* <th scope="col" className="p-4">
                              <div className="flex items-center">
                                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                              </div>
                          </th> */}
                          <th scope="col" className="py-3 px-6 pl-10 text-left">
                              Name
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                              Tenants
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                              Capacity
                          </th>
                          <th scope="col" className="py-3 px-6 text-center">
                              Status
                          </th>
                          {/* <th scope="col" className="py-3 px-6">
                              Created at
                          </th> */}
                          <th scope="col" className="py-3 px-6">
                              Action
                          </th>
                      </tr>
                  </thead>
                  <tbody>
      {servers && servers.map((data:any, index:any)=>
            {
                return (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            {/* <td className="p-4 w-4">
                <div className="flex items-center">
                    <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                </div>
            </td> */}
            <th scope="row" className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
                {/* <img className="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image"> */}
                <div className="pl-3">
                    <div className="text-base font-semibold">{data?.details?.name}</div>
                    <div className="font-normal text-gray-500">{data?.url}</div>
                </div>  
            </th>
            <td className="py-4 px-6 text-center">
                {data?.tenants?.length}
            </td>
            <td className="py-4 px-6 text-center">
            {data?.capacity}
            </td>
            <td className="py-4 px-6 items-center">
                <div className="flex items-center" style={{margin: 'auto', width: 'fit-content'}}>
                    {data?.active ? 
                        <><div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> Active</> 
                        : <><div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-2"></div> Disabled</> 
                    }
                </div>
            </td>
            {/* <td className="py-4 px-6">
            {data.created_at}
            </td> */}
            <td className="py-4 px-6">
                {/* <!-- Modal toggle --> */}
                {/* <a href="#" type="button" data-modal-toggle="editUserModal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Details</a> */}
                <Link href={"/server/" + data.id}>
                    <div data-modal-toggle="editUserModal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Details</div>                  
                </Link>
            </td>
            </tr>)
            }
            )}
            </tbody>
            </table>
            </div>


      {/* <Card
      key={data.id}
      title= {data?.details?.name}
    > 
    URL: {data?.url} <br />
    Capacity: {data?.capacity}

    </Card>)}   */}
    </div>
  </section>)
}