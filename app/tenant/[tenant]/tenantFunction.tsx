'use server'

import { getTenantById, getSubscriptionById, getServerRecord } from '@/app/supabase-server';

export async function tenantDataFunction (id:any) {
  const req = await getTenantById(id)
  return req
}

export async function subscriptionDataFunction (id:any) {
  const req = await getSubscriptionById(id)
  return req
}

export async function serverDataFunction (id:any) {
  const req = await getServerRecord(id)
  return req
}