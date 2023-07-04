import { Database } from '@/types_db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserDetails(id: any) {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase

      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      // .single()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getPricingTable = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('prices').select();

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getServers = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('servers')
    .select('id, details, active, capacity, tenants(id, created_at, domain)');

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getAccountManagers = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('account_managers').select();

  if (error) {
    console.log(error.message);
    throw error;
  }
  // TODO: improve the typing here.
  return data ?? [];
};

export const getTenants = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tenants')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getUsers = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*, subscriptions(*), tenants(*)')
    .order('full_name', { ascending: true });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getServerRecord = async (serverId: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('servers')
    .select(
      'id, active, created_by, location, version, details, capacity, url, plans, add_ons, status, created_at, dns_address'
    )
    .eq('id', serverId);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return (data as any) || [];
};

export const createServerRecord = async (server: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('servers')
    .insert(server)
    .select('id')
    .single();

  if (error) {
    console.log(`Server wasn't created: ${error}`);
    throw error;
  } else {
    console.log(`Server created: ${server.active}`);
  }

  return (data as any) || [];
};

export const updateServerRecord = async (items: any, serverId: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('servers')
    .update(items)
    .eq('id', serverId)
    .select('id, plans');

  if (error) {
    console.log(error.message);
    throw error;
  }

  return (data as any) || [];
};

export const getServerRecordWithTenants = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('servers')
    .select('id, details, active, capacity, plans');

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getTenantById = async (id: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getSubscriptionById = async (id: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const createTenantForCheckout = async (e: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tenants')
    .insert(e)
    .select('*');

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getTenantByStripeSessionId = async (id: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
  .from('tenants')
  .select('*')
  .eq('stripe_session_id', id)

  if (error) {
    console.log(error.message);
    return error;
  }

  return data ?? [];
}

export const getSubscriptionByStripeSessionId = async (id: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('stripe_session_id', id)

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
}
