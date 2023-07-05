'use client'

import { useState, useEffect } from 'react';
import { beginTenantCreation, getTenantDetails, createTenantRecord } from './helperFunctions'

export default function Page({ params }: { params: { subscription: string } }) {
  const [existingTenant, setExistingTenant] = useState(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    createSubscription()
    details()
  }, []);

  const createSubscription = async() => {
    const req = await beginTenantCreation(params?.subscription)
    console.log(req)
  }

  const details = async () => {
    const req = await getTenantDetails(params?.subscription)
    console.log(req)
  }

  // const tenant = async (data:any) => {
  //   const req = await createTenantRecord(data)
  // }

  return (
    <>
      <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
        Subscription: {params?.subscription}
      </h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-white">
        Proggress
      </p>

      {existingTenant &&
        <div className="p-4 mb-4 text-center text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
          💪 Tenant alrady exisits, redirecting to that Tenants page in couple of seconds
        </div> 
      }

      {!existingTenant &&
      <div>     
        <ol className="space-y-5 w-100">
          <li>
            <div className={progress == 1 ? "text-lime-600" : "text-lime-600"} role="alert">              
                <h3 className="font-medium">1. Checking request data</h3>               
              </div>
          </li>
          <li>
            <div className={progress < 2 ? "text-slate-500" : "text-lime-600"}  role="alert">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">2. Confirming payment</h3>                    
              </div>
            </div>
          </li>
          <li>
            <div className={progress < 3 ? "text-slate-500" : "text-lime-600"} role="alert">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">3. Creating tenant</h3>
              </div>
            </div>
          </li>
          <li>
            <div className={progress < 4 ? "text-slate-500" : "text-lime-600"} role="alert">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">4. Review</h3>
              </div>
            </div>
          </li>
          <li>
          <div className={progress < 5 ? "text-slate-500" : "text-lime-600"} role="alert">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">5. Confirmation</h3>
              </div>
            </div>
          </li>
        </ol>
      </div>
    }

    </>
  );
}
