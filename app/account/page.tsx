import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription,
  getTenants
} from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
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

export default async function Account() {
  const [session, subscription] = await Promise.all([
    getSession(),
    getTenants()
  ]);

  // console.log(session?.user.id)

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  async function getUserInfo(user: any) {
    'use server';
    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();
    if (error) {
      console.log(error);
    }

    return data;
  }

  // const userInfo = await getUserInfo(user)
  const userInfo = await getUserDetails(user?.id);

  const subscriptionPrice = (data: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((data?.prices?.unit_amount || 0) / 100);
  };

  // console.log(subscription)
  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { data, error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id);
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  return (
    <section className="mb-32 dark:bg-black dark:text-white bg-white text-black">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Account
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-white">
          Your personal details and list of subscriptions
        </p>
      </div>

      <div className="mt-8 flow-root">
        <div className="">
          <Input
            type="text"
            name="email"
            label="Email"      
            defaultValue={user ? user.email : ''}
            placeholder="Your email"
            maxLength={64}
          />

          <Input
            type="text"
            name="name"
            label="Name"
            defaultValue={userInfo?.full_name ?? ''}
            placeholder="Your name"
            maxLength={64}
          />
        </div>

        <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
      </div>

      <div className="relative mt-20 mb-20 ml-[-100px] mr-[-100px]">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500"></span>
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
                {subscription &&
                  subscription.map((data: any, index: any) => {
                    console.log(data);
                    return (
                      <>
                        <tr key={index}>
                          <td
                            className={classNames(
                              index !== subscription.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 dark:text-white'
                            )}
                          >
                            {data?.domain.name}.{data?.domain.host}
                          </td>
                          <td
                            className={classNames(
                              index !== subscription.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                            )}
                          >
                            <div className="flex items-center">
                              <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>{' '}
                              Online
                            </div>
                          </td>
                          <td
                            className={classNames(
                              index !== subscription.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                            )}
                          >
                            {formatDate(data.created_at)}
                          </td>
                          <td
                            className={classNames(
                              index !== subscription.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                            )}
                          >
                            <Link href={'/tenant/' + data.id}>
                              <span
                                data-modal-toggle="editUserModal"
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                Details
                              </span>
                            </Link>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}
