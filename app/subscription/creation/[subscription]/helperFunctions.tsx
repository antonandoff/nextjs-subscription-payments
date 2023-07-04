'use server'

import { getTenantByStripeSessionId, getSubscriptionByStripeSessionId, getServerRecord } from '@/app/supabase-server'



export async function getTenantDetails (stripe_id:any) {
  const req = await getTenantByStripeSessionId(stripe_id)
  return req
}


export async function beginTenantCreation (stripe_id: any) {
  const tenant:any = await getTenantDetails(stripe_id);

  // check if tenant already exists
  if (tenant && tenant[0]) {
    const server = await getServerRecord(tenant[0].server)

    const subscription = await getSubscriptionByStripeSessionId(stripe_id)
    const productId = tenant[0].product
    const tenantBaseSpecs = server[0].plans
    const productWithId = tenantBaseSpecs.filter((plan:any) => plan.id === productId)    
    const subscriptionItems = await getSubsriptionListItems(subscription[0].id)
    const planSpecs = productWithId[0].features;
    const addOnSpecs = tenant[0].add_ons;
  
    // let's take the latest metadata from product itself
    // addOnSpecs.forEach((item:any, index:any) => {
    //   const latestData = subscriptionItems.productDetails[item.id][0];
    //   addOnSpecs[index].metadata = latestData.metadata
    // })

    const data = {
      server: server,
      sub: subscription,
      prop: productId,
      prodId: productWithId,
      subItem: subscriptionItems,
      plan: planSpecs,
      addons: addOnSpecs
    }
    
    return data;

    // await connectToPbxAndCreateNewTenant(server[0], tenant[0], planSpecs, addOnSpecs, subscription[0])
  } else {
    console.log('ooops')
  }
}


const getSubsriptionListItems = async (subscription_id: any) => {
  try {
    const data = {
      subscription_id: subscription_id
    }
    const req = await fetch('/api/subscription-list-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const res =  await req.json(); 
    return res     
  } catch (error) {
    console.log(error);
    return { error: "something went wrong"}
  } 
}



const connectToPbxAndCreateNewTenant = async (server:any, tenant:any, plan:any, addOn:any, subscription:any) => {
  const data = {
    domain: tenant.domain,
    server: server.id,
    subscription: subscription.id,
    tenant: tenant.id
  }

  // createTenantRecord(data)
  try {
    const req = await fetch('/api/pbx/tenant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const res = await req.json();
    // console.log(res)

    // setProgress(3)
    connectToPbxAndCreateAccounts(tenant, server, subscription)
  } catch (error) {
    console.log(error);
  } finally { 
    console.log('success')
  }
}

const connectToPbxAndCreateAccounts = async (tenant:any, server:any, subscription:any) => {
  console.log(tenant)
  console.log(server)
  console.log(subscription)
  // pull this data from the users profile
  // at the next stage prob is better
  const data = {
    domain: tenant.domain,
    server: server.id,
    // user email
    // user phone
    // user country code
    email: user?.email,
    phone: user?.phone,
    ip_address: '',
    display_name: '',
    country_code: '49',
    subscription: subscription,
    tenant: tenant.id
  }

  try {
    const req = await fetch('/api/pbx/tenant_config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const res = await req.json()

    // setProgress(4)

    // finalStep()
  } catch (error) {
    console.log(error);
  } finally { 
    console.log('success')
  }
}