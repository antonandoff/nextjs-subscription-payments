'use client';

import { activeAddOns } from './addonFunctions';
import { Database } from '@/types_db';
import { useEffect, useState } from 'react';

type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface Props {
  data?: any;
  id: any;
  addPlanToServer: any;
  removePlanFromServer: any;
}

export default function Add({ id, addAddOnToServer }: any) {
  const [isActive, setIsActive] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [features, setFeatures] = useState<any[]>([]);
  const [planDetails, setPlanDetails] = useState<any[]>([]);
  const [stripeSubscriptions, setStripeSubscriptions] = useState<any[]>([]);
  const [planPrice, setPlanPrice] = useState<ProductWithPrices | any>();
  const [planList, setPlanList] = useState<any[]>([]);
  const [addOnAdded, setAddOnAdded] = useState(false);
  const [addOnClass, setAddOnClass] = useState('');

  interface Props {
    products: Product[];
  }

  useEffect(() => {
    console.log(id);
    // setPlanOptions()
    getPricing();
  }, []);

  async function getPricing() {
    const pricingData = await activeAddOns();
    const pricingDataWithAddOns = pricingData.filter(
      (item: any) => item.metadata.type === 'add-on'
    );
    // console.log(pricingDataWithAddOns)
    setStripeSubscriptions(pricingDataWithAddOns);
  }

  const addToTenantOption = (plan: any) => {
    // addAddOnToServer(plan);
  };

  return (
    <>
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {stripeSubscriptions &&
          stripeSubscriptions.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className="block max-w-sm p-6 bg-white border rounded hover:bg-gray-100 dark:border-white dark:bg-black dark:text-white text:black"
                onClick={(e)=>{
                  addToTenantOption(item);
                  (e.target as Element).classList.toggle('dark:border-white');
                  (e.target as Element).classList.toggle('border-indigo-600');
                }}
              >
                <h5
                  className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  style={{ pointerEvents: 'none' }}
                >
                  {item.name}
                </h5>
                <h5
                  className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400"
                  style={{ pointerEvents: 'none' }}
                >
                  ${item.prices[0].unit_amount / 100}/{item.prices[0].interval}{' '}
                </h5>
                <p
                  className="font-normal text-gray-700 dark:text-gray-400"
                  style={{ pointerEvents: 'none' }}
                >
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
}
