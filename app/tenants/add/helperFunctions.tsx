'use server'

import { getServerRecordWithTenants } from '@/app/supabase-server';

export async function serversWithTenants(){
  const req = await getServerRecordWithTenants()
  return req;
}