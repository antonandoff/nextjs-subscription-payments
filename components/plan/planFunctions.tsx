"use server"
import {getActiveProductsWithPrices} from '@/app/supabase-server';

export async function activePlans(){
  const pricingData =  await getActiveProductsWithPrices();
  const pricingDataWithPlans = pricingData.filter((item:any)=> item.metadata.type === 'plan');
  return pricingDataWithPlans
}