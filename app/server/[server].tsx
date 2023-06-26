"use client"; // This is a client component 👈🏽

import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Subscriptions() {
  const router = useRouter();
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;
  if (!session) {
    return redirect('/signin');
  }

  useEffect(()=>{
    if(router.isReady && router.query.server){
      console.log(router.query.server)      
    }
  }, [router.isReady])


  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Subscriptions 
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Header 2
          </p>
        </div>
      </div>
     
    </section>
  );
}
