"use server"

import { createServerRecord } from '@/app/supabase-server';
import { hashAndDigestPassword } from 'utils/pbx'
import { postData } from '@/utils/helpers';

var sessionCookie = '';
var sessionUrl = '';
var sessionServerId = '';

export async function hashPassword(e:any) {
  const req = await hashAndDigestPassword(e)
  return req
}

export async function createServer(data:any) {
  const req = await createServerRecord(data)
  return req
}

const axiosRequest = async (method:any, url:any, data:any) => {
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

export async function  authenticateWithPbx (data:any) {

  console.log(data)
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