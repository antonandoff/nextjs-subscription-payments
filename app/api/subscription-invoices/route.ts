import { stripe } from 'utils/stripe';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { cookies, headers } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { getURL } from '@/utils/helpers';
import { Database } from '@/types_db';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    // 1. Destructure the price and quantity from the POST body
    const { subscription, price, quantity = 1, metadata = {} } = await req.json();

    try {
      // 2. Get the user from Supabase auth
      const supabase = createRouteHandlerClient<Database>({cookies});
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      const invoices = await stripe.invoices.list({
        subscription: subscription
      });

      return new Response(JSON.stringify({ invoices: invoices }), {status:200});
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
};
