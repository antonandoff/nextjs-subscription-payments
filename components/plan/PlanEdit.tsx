import { activePlans } from './helperFunctions';
import { Database } from '@/types_db';
import { useState, useEffect } from 'react';

type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}

interface Props {
  data?: any;
  addPlanToServer?: any;
  removePlanFromServer?: any;
  onFeatureChange?: any;
  onPlanChange?: any
  features?: any;
  plan?: any;
}


function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function PlanEdit(props: Props) {
  const [plans, setPlans] = useState<any[]>([]);
  const [planPrice, setPlanPrice] = useState<ProductWithPrices | any>();
  const data = props.data;
  const features = props.features;

  const handleFeatureChange = (event:any, featureType:any) => {
    const newValue = parseInt(event.target.value, 10);
    props.onFeatureChange(featureType, newValue);
  };

  useEffect(() => {
    getPricing();
  }, []);

  async function getPricing() {
    const req = await activePlans();
    setPlans(req);
  }

  function selectPricePlan(data: any) {
    console.log(data.target.value)
    if (data.target.value == 'default') {
      data.preventDefault();
    } else {
      setPlanPrice(JSON.parse(data.target.value));
      props.onPlanChange(JSON.parse(data.target.value))
    }
  }

  return (
    <div className="dark:text-white">
      <div
        key={data.id}
        className={classNames(
          data?.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
          'rounded p-8'
        )}
      >
        <div className="mb-6">
          <label htmlFor="serverCountry" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Price
          </label>
          <select
            onChange={(e) => selectPricePlan(e)}
            id="serverCountry"
            style={{ appearance: 'none' }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={JSON.stringify(planPrice)}
          >
            <option value="default">Choose a subscription plan</option>
            {plans &&
              plans.map((data: any, index: any) => {
                if (data.prices[0])
                  return (
                    <option key={index} value={JSON.stringify(data)}>
                      {data.name}: {data?.prices[0]?.unit_amount / 100}/
                      {data?.prices[0]?.interval}
                    </option>
                  );
              })}
          </select>
        </div>
        <a
          href={data?.href}
          aria-describedby={data?.id}
          className={classNames(
            data?.mostPopular
              ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
              : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:text-white',
            'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          )}
        >
          Buy plan
        </a>
        <table className='w-full'>
        <tbody
          role="list"
          className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white"
        >
          {features.map((data: any, index: number) => {
            if (data.input == 'checkbox') {
              return (
                
                  <tr key={index} className="">
                    <td className="py-2 px-3 text-left">{data.name}</td>

                    <td className="py-2 px-2 w-3">
                      <input
                        name={data.name}
                        type={data.input}
                        defaultValue={data.value}
                        className="p-0"
                        checked={!!data.value}
                        onChange={(e) => handleFeatureChange(e, data.type)}
                      />
                    </td>
                  </tr>
                
              );
            } else {
              return (
             
                  <tr key={index} className="">
                    <td className="py-2 px-3 text-left">{data.name}</td>

                    <td className="py-2 px-2 w-20">
                      <input
                        name={data.name}
                        type={data.input}
                        defaultValue={data.value}
                        onChange={(e) => handleFeatureChange(e, data.type)}
                        className="w-full m-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-0"
                        min={0}
                      />
                    </td>
                  </tr>
             
              );
            }
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
}
