'use server'

import { getTenantByStripeSessionId, getSubscriptionByStripeSessionId, getServerRecord, getServerAdmin, setTenantSubscriptionId, setTenantAdminCredentials } from '@/app/supabase-server'
import { hashAndDigestPassword } from 'utils/pbx'

var sessionCookie = '';

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
    // const subscriptionItems = await getSubsriptionListItems(subscription[0].id)
    const planSpecs = productWithId[0].features;
    const addOnSpecs = tenant[0].add_ons;
  
    // let's take the latest metadata from product itself
    // addOnSpecs.forEach((item:any, index:any) => {
    //   const latestData = subscriptionItems.productDetails[item.id][0];
    //   addOnSpecs[index].metadata = latestData.metadata
    // })

    const data = {
      server: server[0],
      tenant: tenant[0],
      sub: subscription[0],
      plan: planSpecs,
      addons: addOnSpecs,
      prop: productId,
      // prodId: productWithId,
      // subItem: subscriptionItems[0]            
    }
    
    // return data;

    const req = await connectToPbxAndCreateNewTenant(server[0], tenant[0], planSpecs, addOnSpecs, subscription[0])
    return req;
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


export async function connectToPbxAndCreateNewTenant (server:any, tenant:any, plan:any, addOn:any, subscription:any){
  const data = {
    domain: tenant.domain,
    server: server.id,
    subscription: subscription.id,
    tenant: tenant.id
  }

  // old /api/pbx/tenant
  const reqTenant = await createTenantRecord(data)
  const reqAccount = await connectToPbxAndCreateAccounts(tenant, server, subscription)

  return ({createTenant: reqTenant, createAccounts: reqAccount})
}


export const createTenantRecord = async (data:any) => {
  var sessReq:any;

  // tenantReq:any;

  const tenantName = data.domain.name + "." + data.domain.host;  
  data.tenantName = tenantName;
  
  const serverAdminDetails:any = await getServerAdmin(data.server);

  // if(!sessReq)
  const authData = {
    url: serverAdminDetails?.url,
    name: serverAdminDetails?.credentials.username,
    password: serverAdminDetails?.credentials.password
  }



  const req = await authenticateWithPbx(authData)

  
   
  const tenantReq = await createPbxTenant(serverAdminDetails?.url, data)

  // const stuff = {
  //     ses: sessReq,
  //     auth: authReq,
  //     tenant: tenantReq,
  // }

  // return {data, stuff}
  return {authData, serverAdminDetails, req, tenantReq};
}


export async function  authenticateWithPbx (data:any) {  
  const axios = require("axios");
  axios.defaults.withCredentials = true;
  // return data
  // const crypto = require('crypto');
  // const password = crypto.createHash('md5').update(data.password).digest('hex');
  const vars = { name: 'auth', value: data.name + ' ' + data.password };
  // return vars
  const req = await axiosRequest('post', data.url + "/rest/system/session", JSON.stringify(vars))
  // update sessionid on DB
  // updateServersSessionId(req)
  // update sessionId locally
  sessionCookie = req;
  
  // signall 
  return req;
}


export const axiosRequest = async (method:any, url:any, data:any) => {
  const axios = require("axios");
  const https = require("https");
  const crypto = require('crypto')
  const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8',  "Cookie": "session=" + sessionCookie}
  const httpsAgent = new https.Agent({
      maxVersion: "TLSv1.2",
      minVersion: "TLSv1.1",
      rejectUnauthorized: false,
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
  });

  // right way to set header cookies in axios
  axios.defaults.headers.Cookie = "session=" + sessionCookie;

  // make that request
  const req = axios({ method: method, url: url, data: data, httpsAgent, headers: jsonHeaders });
  const res = await req;

  // return requests reply
  return res.data;
}

export const createPbxTenant = async (url:string, data: any) => {
  const domainAPI = url + "/rest/system/domains";
  const domainPayload = [data.tenantName];

  const req = await axiosRequest('post', domainAPI, JSON.stringify(domainPayload));
  return req
}



export const connectToPbxAndCreateAccounts = async (tenant:any, server:any, subscription:any) => {

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
    // email: user?.email,
    // phone: user?.phone,
    ip_address: '',
    display_name: tenant.domain,
    country_code: '',
    subscription: subscription,
    tenant: tenant.id
  }

  const req = await createAdminForTenant(data)
  return req;
}


const createAdminForTenant = async (data:any) => {
  const tenantName = data.domain.name + "." + data.domain.host;
  
  data.tenantName = tenantName;
  
  // get data from the db since we don't keep pass on the front
  // serverId - id of the server from DB
  const serverAdminDetails:any = await getServerAdmin(data.server);
  // check if sessionId is still valid

  // check if need to login again or just use the old session 
  // sessionCookie from the local variable
  // sessReq = await checkSessionIdValidity(sessionCookie);
  
   // reauthenticate if not
   // url - url of PBX
   // {username, password}
   const authData = {
    url: serverAdminDetails?.url,
    name: serverAdminDetails?.credentials.username,
    password: serverAdminDetails?.credentials.password
  }

  const authReq = await authenticateWithPbx(authData)       
  const tenantSetting = await createTenantAdminUser(serverAdminDetails?.url, data)
  


  // return stuff for better debugging
  return {data, tenantSetting}
}


const createTenantAdminUser = async (url:string, data:any) => {  
  // let's use this basic library of random words to get us to the finish line
  // will need to review and replace it with smth more sophisticated
  var random_user_name = require('random-username-generator'); 
  var name = random_user_name.generate();
  var pass = random_user_name.generate() 

  const configAPI = url + "/rest/domain/" + data.tenantName + "/config";
  const configPayload = {
    "admins": [
      {
          "name": name,
          "email": data?.email || '',
          "phone": data?.phone || '',
          "password": pass, 
          "adr": data?.ip_addresses || ''
      }
   ],
   "display": data?.display_name || '',
   "country_code": data?.country_code || ''
  }

  //if it goes through save credentials to the DB
  const tenantAdmin = await setTenantAdminCredentials(name, pass, data.tenant)
  const tenantSubscription = await setTenantSubscriptionId(data.tenant, data.subscription.id)
   
  try {
    // send the request to create domain
    const configReq = await axiosRequest('post', configAPI, JSON.stringify(configPayload));
    return {message: 'ok', payload: configPayload, conf: configReq, ta: data}
  } catch (e) {
    return {message: e, configAPI, configPayload}
  }
}