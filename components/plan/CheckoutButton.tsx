'use client';

import { useState, useEffect } from 'react';
import { getStripe } from '@/utils/stripe-client';
import { randomWords, createTenant, getUserId } from './helperFunctions'

interface Props {
  data?: any
  features?: any
  plan?:any
  server?:any
}


function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CheckoutButton(props: Props) {
  const [user, setUser] = useState()

  // useEffect(()=>{
  //   getUser()
  // }, [])

  async function getUser(){
    const req = await getUserId()
    return req?.id
  }


  const data = props.data;
  const plan = props.plan;
  const server = props.server;
  const features = props.features;

  const stripeCheckout = async () => {
    const planPrice = plan.prices[0];
    
    // const addOns = serverDetails.add_ons.filter(
    //   (item: any) => item.quantity > 0
    // );
    // console.log(addOns)
    // console.log(planPrice)

    // const addOnPrices = addOns.map((item: any) => item.prices[0]);
    // console.log(addOnPrices)

    console.log(plan)
    console.log(server)
    console.log(await getUser())

    try {
      const req = await fetch('/api/create-checkout-session-line-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ plan: planPrice, addOns: addOns })
        body: JSON.stringify({ plan: planPrice })

      });

      if (!req.ok) {
        console.log('Error in postData');
        throw Error(req.statusText);
      }

      const res = await req.json();
      console.log(res);
      // we can use sessionId to create a tenant, then when subscription is ready with the session Id matching session of a tenant
      // we can start the whole process of creation

      const name = await randomWords();
      // create the tenant and wait for checkout to complete
      const tenantCreation = await createTenant({
        stripe_session_id: res.sessionId,
        domain: {
          name: name,
          host: 'anton.vodia.com'
        },
        server: server.id,
        product: plan.id,
        // add_ons: addOns,
        plan: plan,
        created_by: await getUser()
      });

      console.log(tenantCreation[0])

      // console.log(user?.id);

      const stripe = await getStripe();
      stripe?.redirectToCheckout({
        sessionId: res.sessionId
      });
    } catch (error) {
      console.log(error);
    } finally {
      console.log('success');
    }
  };


  // const handleCheckout = async (price: any) => {
  //   if (!user) {
  //     return router.push('/signin');
  //   }
  //   if (price.product_id === subscription?.prices?.products?.id) {
  //     return router.push('/account');
  //   }
  //   try {
  //     const { sessionId } = await postData({
  //       url: '/api/create-checkout-session',
  //       data: { price }
  //     });

  //     const stripe = await getStripe();
  //     stripe?.redirectToCheckout({ sessionId });
  //   } catch (error) {
  //     return alert((error as Error)?.message);
  //   } 
  // };

  return (
    <>
      <button
        onClick={()=> stripeCheckout() }
        aria-describedby={data?.id}
        className={classNames(
          data?.mostPopular
            ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
            : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:text-white',
          'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full'
        )}
      >
        I'm a checkout button
      </button>
    </>
  );
}
