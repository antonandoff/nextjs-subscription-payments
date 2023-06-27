'use client';

import Link from 'next/link';

interface Props {
  data: any;
}

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  return formattedDate;
}

export default function TableEntry({ data }: Props) {
  return (
    <tr>
      <td className="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium dark:text-white text-gray-900 sm:pl-6 lg:pl-8">
        <div className="text-base font-semibold">{data?.details?.name}</div>
        <div className="font-normal text-gray-500">{data?.url}</div>
      </td>
      <td className="whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
        <div className="flex items-center"> {data?.tenants?.length} </div>
      </td>
      <td className="whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
        {data?.capacity}
      </td>
      <td className="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500" >
      <div className="flex items-center" style={{margin: 'auto', width: 'fit-content'}}>
        {data?.active ? 
          <><div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> Active</> 
          : <><div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-2"></div> Disabled</> 
        }
        </div>
      </td>
      <td className="relative whitespace-nowrap border-b border-gray-200 py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8">
        <Link href={'/server/' + data.id}>
          <button
            type="button"
            data-modal-toggle="editUserModal"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Details
          </button>
        </Link>
      </td>
    </tr>
  );
}
