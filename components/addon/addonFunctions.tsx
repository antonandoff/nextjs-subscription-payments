"use server"
import { getActiveProductsWithPrices } from '@/app/supabase-server';

export async function activeAddOns(){
  const pricingData =  await getActiveProductsWithPrices();
  const pricingDataWithPlans = pricingData.filter((item:any)=> item.metadata.type === 'add-on');
  return pricingDataWithPlans
}