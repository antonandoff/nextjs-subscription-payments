import { useState, useEffect } from 'react';
import { activePlans } from './planFunctions'
import { Database } from '@/types_db';

type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}

interface Props {
  data?: any
  addPlanToServer?: any
  removePlanFromServer?: any
  features?:any
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function PlanEdit(props: Props) {
  const [plans, setPlans] = useState<any[]>([])
  const [planPrice, setPlanPrice] = useState<ProductWithPrices | any>()
  const data = props.data
  const features = props.features

  useEffect(()=>{
    getPricing()
  },[])

  async function getPricing(){
    const req = await activePlans()
    setPlans(req)
  }

  function selectPricePlan(data:any){
    if(data.target.value == 'default'){
      data.preventDefault()
    } else {
      setPlanPrice(JSON.parse(data.target.value))    
    }
  }

  
  return (
    <div className="dark:text-white">
      <div
        key={data.id}
        className={classNames(
          data?.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
          'rounded-l p-8'
        )}
      >
            <div className="mb-6">
              <label htmlFor="serverCountry" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                <select onChange={(e)=>selectPricePlan(e)} id="serverCountry" style={{appearance: 'none'}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={JSON.stringify(planPrice)}>
                  <option value="default">Choose a subscription plan</option>
                  {plans && plans.map((data:any, index:any) => 
                    {
                      if(data.prices[0]) return <option key={index} value={JSON.stringify(data)}>{data.name}: {data?.prices[0]?.unit_amount / 100}/{(data?.prices[0]?.interval)}</option> ;                  
                    }                    
                  )}
                </select>
            </div>
        <a
          href={data.href}
          aria-describedby={data.id}
          className={classNames(
            data.mostPopular
              ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
              : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:text-white',
            'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          )}
        >
          Buy plan
        </a>
        <ul
          role="list"
          className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white"
        >
          {features.map((data: any, index: number) => {
            var liClass, svgClass, textClass;
            if (data.value == 0 || data.value == false) {
              liClass = 'flex space-x-3 line-through decoration-gray-500';
              svgClass =
                'flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500';
              textClass = 'text-base font-normal leading-tight text-gray-500';
            } else {
              liClass = 'flex space-x-3';
              svgClass =
                'flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-500';
              textClass =
                'text-base font-normal leading-tight text-gray-500 dark:text-gray-400';
            }
            return (
              <li key={index} className={liClass}>
                <svg
                  aria-hidden="true"
                  className={svgClass}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className={textClass}>
                  {data.value} {data.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}