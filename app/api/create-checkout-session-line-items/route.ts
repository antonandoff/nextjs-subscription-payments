import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { getURL } from '@/utils/helpers';
import { Database } from '@/types_db';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { plan, addOns, metadata = {} } = await req.json();
    
    try {
      const supabase = createRouteHandlerClient<Database>({cookies});
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      // create an array to put all the items in there
      const combined_line_items = [];

      // add the plan price
      combined_line_items.push({price: plan.id, quantity: 1});

      if(addOns){
        addOns.forEach((item:any) => {
          combined_line_items.push({price: item.prices[0].id, quantity: item.quantity})
        });
      }
      

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: combined_line_items,
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata
        },
        success_url: `${getURL()}/tenant_create/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${getURL()}/`
      });
      
      return new Response(JSON.stringify({ sessionId: session.id  }), {status:200});
    //  return res.status(200).json({list: combined_line_items})
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




  
