'use client';

import Plan from '@/components/plan/Plan';
import AddOn from '@/components/addon/AddOn'
import Input from '@/components/ui/Input';
import { useState } from 'react';

interface Plan {
  id: number;
  name?: object;
  features?: object;
  view?: string;
}

export default function Form() {
  const [plans, setPlans] = useState<Array<Plan>>([{ id: 1, view: 'edit' }]);
  const [nextPlanId, setNextPlanId] = useState(2);

  const addPlan = () => {
    setPlans((prevPlans) => [...prevPlans, { id: nextPlanId, view: 'edit' }]);
    setNextPlanId((prevId) => prevId + 1);
  };

  const removePlan = (planId: any) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
  };

  const updatePlans = (id: any, plan?: any, features?: any) => {
    console.log(id);
    setPlans((prevPlans) =>
      prevPlans.map((prevPlan) =>
        prevPlan.id === id ? { ...prevPlan, plan, features } : prevPlan
      )
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    console.log(plans);

    // Get plan values
    // const planValues = featuresSet.map((feature) => {
    //   return {
    //     name: feature.name,
    //     value: feature.value,
    //     input: feature.input,
    //     type: feature.type,
    //   };
    // });

    // Combine form data and plan values
    // const allData = {
    //   ...formValues,
    //   plans: planValues,
    // };

    // Log the data to the console or perform any other operations
    // console.log('Form Data:', allData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-black dark:text-white px-3 text-base font-semibold leading-6 text-gray-900">
            Server details
          </span>
        </div>
      </div>

      <div className="px-8 py-5 sm:p-10">
        <Input label="Country" />
        <Input label="Server name" />
        <Input label="Server description" />
        <Input label="Support link" />
        <Input label="Tenants capacity" />
        <Input label="Primary DNS zone" />
      </div>
      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-black dark:text-white px-3 text-base font-semibold leading-6 text-gray-900">
            PBX credentials
          </span>
        </div>
      </div>

      <div className="px-8 py-5 sm:p-10">

      <Input label="Server URL" name="" />
      <Input label="Admin username" name="" />
      <Input label="Admin password" name="" />
      </div>


      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-black dark:text-white px-3 text-base font-semibold leading-6 text-gray-900">
            Plan creation
          </span>
        </div>
      </div>

      {/* Your other form inputs */}
      <div className="px-8 py-5 sm:p-10">
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id}>
            <Plan formSubmit={updatePlans} data={plan} />
            <button type="button" onClick={() => removePlan(plan.id)}>
              Remove Plan
            </button>
          </div>
        ))}
        <div className="ring-1 ring-gray-200 rounded p-8">
          <button type="button" onClick={addPlan}>
            Add Plan
          </button>
        </div>
      </div>
      </div>

      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-black dark:text-white px-3 text-base font-semibold leading-6 text-gray-900">
            Add-ons creation
          </span>
        </div>
      </div>
      <div className="px-8 py-5 sm:p-10">
          <AddOn />
          </div>
      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-black dark:text-white px-3 text-base font-semibold leading-6 text-gray-900">
            Connect PBX and create subscription offers
          </span>
        </div>
      </div>

      <div className="px-8 py-5 sm:p-10">


      


      <button className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' type="submit">Submit</button>
      </div>
    </form>
  );
}
