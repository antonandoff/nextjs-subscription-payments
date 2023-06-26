"use server"
import { updateServerRecord, createServerRecord, getServerRecord } from '@/app/supabase-server';

export async function updateRecord(data:any, id:any) {
 const req = await updateServerRecord(data, id)
 // const res = await req;

 // console.log(res)
 return req
}

export async function createRecord(data:any) {
 const req = await createServerRecord(data)
 return req
}

export async function getRecord(data:any) {
 const req = await getServerRecord(data)
 return req;
}