import { getSession, getUsers, getPricingTable } from '@/app/supabase-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

export default async function Users() {
  const [session, users, pricing] = await Promise.all([getSession(), getUsers(), getPricingTable()]);

  const user = session?.user;
  if (!session) {
    return redirect('/signin');
  }

  function PaymentComponent(data:any){
    var value = 0;
    var currency = '$'
    if(data.data.subscriptions.length > 0){
      data.data.subscriptions.map(((item:any) => {
        if(item.status === 'active'){
          const priceData = (pricing)?.filter((unit:any) => unit.id == item.price_id)
          const priceEntry = priceData[0];
          const priceFrequency = (priceEntry.interval == 'month' ? 1 : 12)
          if(priceEntry && priceEntry.unit_amount && priceEntry.currency){
            value = (value + (priceEntry.unit_amount / priceFrequency / 100))
            currency = priceEntry.currency == 'usd' ? '$' : priceEntry.currency;
          }                     
        }
      }))
    }
    return <div>{currency} {value.toFixed(2)} / month</div>
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-white">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Subscriptions
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Payments
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Account manager
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((data: any, index: any) => (
                      <>
                        <tr key={data.email}>
                          <td
                            className={classNames(
                              index !== users.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 dark:text-white'
                            )}
                          >
                            {data?.full_name}
                          </td>
                          <td
                            className={classNames(
                              index !== users.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                            )}
                          >
                            {data.subscriptions.length}
                          </td>
                          <td
                            className={classNames(
                              index !== users.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                            )}
                          >
                            <PaymentComponent data={data} />
                          </td>
                          <td
                            className={classNames(
                              index !== users.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                            )}
                          >
                            {data?.account_manager}
                          </td>
                          <td
                            className={classNames(
                              index !== users.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                            )}
                          >
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                              <span className="sr-only"> {data.name}</span>
                            </a>
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
