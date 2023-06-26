import {
    createPagesBrowserClient,
    User
  } from '@supabase/auth-helpers-nextjs';
import type { Database } from 'types_db';

// create supabse client that talks to DB
// const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL || '',
//     process.env.SUPABASE_SERVICE_ROLE_KEY || ''
// );

export const supabaseAdmin = createPagesBrowserClient<Database>();

// some vars to use throughtout the code
var sessionCookie = '';
var sessionUrl = '';
var sessionServerId = '';

// create a global axios object (fetch API on steroids)
const axios = require("axios");
axios.defaults.withCredentials = true;


//
// const createTenantRecord = async (data:any) => {
//     var sessReq:any, 
//     authReq:any, 
//     tenantReq:any;

//     const tenantName = data.domain.name + "." + data.domain.host;
    
//     data.tenantName = tenantName;
    
//     // get data from the db since we don't keep pass on the front
//     // serverId - id of the server from DB
//     const serverAdminDetails = await retrieveServerAdmin(data.server);
//      // check if sessionId is still valid

//     // check if need to login again or just use the old session 
//     // sessionCookie from the local variable
//     // sessReq = await checkSessionIdValidity(sessionCookie);
    
//      // reauthenticate if not
//      // url - url of PBX
//      // {username, password}
//     if(!sessReq)
//         authReq = await authenticateWithPbx(serverAdminDetails?.url, {username: serverAdminDetails?.credentials.username, password: serverAdminDetails?.credentials.password})
     
//      // carry on with tenant creation   
//      // url: url
//      // data: 
//     // tenantReq = await createNewTenantPbx(serverAdminDetails?.url, data)
//     tenantReq = await createPbxTenant(serverAdminDetails?.url, data)

//     const tenantSetting = await createNewTenantPbx(serverAdminDetails?.url, data)
    
//     // get all the responses and put'em in one obj
//     const stuff = {
//         ses: sessReq,
//         auth: authReq,
//         tenant: tenantReq,
//         tenantSetting: tenantSetting
//     }

//     // return stuff for better debugging
//     return {data, stuff}
// }

// to keep things secure let's just pass server id, and form data to make magic happen;
const retrieveServerAdmin = async (serverId: any ) => {
    const { data, error } = await supabaseAdmin
    .from('servers')
    .select('credentials, url, session_id')
    .eq('id', serverId)
    .single();

    // if (error) return {url: error, credentials:error, session_id:error };
    
    sessionServerId = serverId;
    sessionCookie = data?.session_id;
    sessionUrl = data?.url;

    return data;
}

const checkSessionIdValidity = async (sessionId:any) => {
    const req = await axiosRequest('get', sessionUrl + "/rest/system/session", "")
    if(req && req.type && req.type == 'admin'){
        return true;
    } else {
        return false;
    }
}

// not sure if it's a good idea to keep the session id, but for now let's do it this way
const updateServersSessionId = async (sessionId:any) => {
    console.log('1')
    const { data, error } = await supabaseAdmin
    .from('servers')
    .update({
        session_id: sessionId
      })
    .eq('id', sessionServerId)
    if (error) return false;

    return true;
}

const axiosRequest = async (method:any, url:any, data:any) => {
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

const axiosRequestWithCookies = async () => {
    const axiosConfig = {
        headers: {
        'content-Type': 'application/json',
        "Accept": "/",
        "Cache-Control": "no-cache",
        "Cookie": document.cookie
        },
        credentials: "same-origin"
    };


    axios.defaults.withCredentials = true;
    axios.get('/url',
    axiosConfig)
    .then((res:any) => {
    // Some result here
    })
    .catch((err:any) => {
    console.log(':(');
    });                
}

const authenticateWithPbx = async (url:any, data:any) => {
    // return data
    // const crypto = require('crypto');
    // const password = crypto.createHash('md5').update(data.password).digest('hex');
    const vars = { name: 'auth', value: data.username + ' ' + data.password };
    // return vars
    const req = await axiosRequest('post', url + "/rest/system/session", JSON.stringify(vars))
    // update sessionid on DB
    // updateServersSessionId(req)
    // update sessionId locally
    sessionCookie = req;
    
    // signall 
    return req;
}

const hashAndDigestPassword = async (string:any) => {
    const crypto = require('crypto');
    const password = crypto.createHash('md5').update(string).digest('hex');
    return password
}

const checkPbxCredentials = async (serverId:any) => {
    const serverAdminDetails = await retrieveServerAdmin(serverId);    
    const auth = await authenticateWithPbx(serverAdminDetails?.url, {username: serverAdminDetails?.credentials.username, password: serverAdminDetails?.credentials.password})
    return auth;
}

// Creates a tenant on the pbx
const createPbxTenant = async (url:string, data: any) => {
    const domainAPI = url + "/rest/system/domains";
    const domainPayload = [data.tenantName];

    const req = await axiosRequest('post', domainAPI, JSON.stringify(domainPayload));
    return req
}


// adds basic info about the tenant
// name, emai, phone, passwd
const createTenantAdminUser = async (url:string, data:any) => {  
    var random_user_name = require('random-username-generator'); 
    var name = random_user_name.generate();
    var password = random_user_name.generate()

   const configAPI = url + "/rest/domain/" + data.tenantName + "/config";
   
   const configPayload = {
    "admins": [
        {
            "name": name,
            "email": data.email || '',
            "phone": data.phone || '',
            "password": await hashAndDigestPassword(await password),
            "adr": data.ip_addresses || ''
        }
    ],
    "display": data.display_name || '',
    "country_code": data.country_code || ''
    }

    console.log(configAPI)
    console.log(configPayload)

    // const configReq = await axiosRequest('post', configAPI, JSON.stringify(configPayload));

    // return {payload: configPayload, conf: configReq}

    return {x: configAPI, y: configPayload}
}

const setupNewTenantAccounts = async (url: string) => {


}

export const createNewTenantDb = async (e: any) => {
    const formData = {
      server: e.server,
      product: e.product,
      domain: e.domain ?? {},
      credentials: {
        username: e.credentials.username,
        password: e.credentials.password
      },
      details: e.details,
      created_by: e.created_by,
    };
  
    const { data, error } = await supabaseAdmin.from('tenants').insert(formData).select();
    if (error) throw error;
    return data;
};

export const createTenantForCheckout = async (e:any) => {
    console.log(e)
    const { data, error } = await supabaseAdmin
        .from('tenants')
        .insert(e)
        .select('*');

    if (error) throw error;
    return data;
}

const updateTenantPreferences = async() => {

}

const createAdminAccountForTenant = async (data:any, url:any, domain:any) => {

}


const removeExistingTenant = async () => {

}

const createTenantAdminAccount = async () => {

}

const removeTenantAdminAccount = async () => {

}

export {
    // createTenantRecord,
    retrieveServerAdmin,
    authenticateWithPbx,
    checkPbxCredentials,
    hashAndDigestPassword,
    createPbxTenant,
    createTenantAdminUser
}