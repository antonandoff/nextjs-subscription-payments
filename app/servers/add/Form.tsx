'use client';

import Plan from '@/components/plan/Plan';
import AddOn from '@/components/addon/AddOn'
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createServer, hashPassword, authenticateWithPbx } from './helperFunctions'
import { postData } from '@/utils/helpers';

interface Plan {
  id: number;
  name?: object;
  features?: object;
  view?: string;
}

interface Props {
  user?: any
  data?: any
}

export default function Form(props: Props) {
  const [plans, setPlans] = useState<Array<Plan>>([{ id: 1, view: 'edit' }]);
  const [addOns, setAddOns] = useState<any[]>([])
  const [nextPlanId, setNextPlanId] = useState(2);
  const [validCredentials, setValidCredentials] = useState(false)

  // need this for server creation part
  const userId = props.user?.user;
  const router = useRouter()

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

  const managetAddOn = (addOnData:any) => {
    console.log(addOnData)
    if(addOns.some((item:any)=> item.id == addOnData.id)){ 
      const newAddOnList = addOns.filter((item:any) => item.id !== addOnData.id )
      setAddOns(newAddOnList)
    } else{
      setAddOns(addOns => [...addOns, addOnData])
    }
  }

  const getValueById = (id: string): string | null => {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element ? element.value : null;
  };


  const checkCredentials = async (e:any) => {
    e.preventDefault();

    console.log(e)

    const url = getValueById('url')
    const admin = getValueById('admin')
    const password = await hashPassword(getValueById('password'))
    const data = {
      url: url,
      name: admin,
      password: password
    }
    const req = await authenticateWithPbx(data) 
    
    if(req.length > 1) {
      setValidCredentials(true)
    } else {
      console.log("try again")
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
  
    // Convert FormData to a regular object
    const e: Record<string, string> = {};
    formData.forEach((value, key) => {
      e[key] = value.toString();
    });
   

    const data = {
      created_by: userId,
        location: e.country,
        version: '',
        details: {
          name: e.name,
          avatar: '',
          info: e.info,
        },
        capacity: e.capacity,
        url: e.url,
        credentials: {
          username: e.admin,
          password: e.password
        },
        plans: plans,
        add_ons: addOns,
        active: true,
        dns_address: e.dns_zone
    }

    console.log(data)
  
    // if(props.id){
    //   await updateServerRecord(form, props.id)
    // } else {
      const serverCreationRequest = await createServer(data);
      console.log(serverCreationRequest)
      if(serverCreationRequest.error){
        console.log('😢 Server creation failed');    
        return
      } else {
        if(serverCreationRequest.id)
          router.push(`/server/${serverCreationRequest.id}`)
      }
    // }    
    // Router.reload()
  }
  // };


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
        <Input label="Country" name="country"/>
        <Input label="Server name" name="name" />
        <Input label="Server description" name="info"/>
        <Input label="Support link" name="support"/>
        <Input label="Tenants capacity" name="capacity" type="number"/>
        <Input label="Primary DNS zone" name="dns_zone"/>
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

        <Input label="Server URL" name="url" type="url" id="url" />
        <Input label="Admin username" name="admin" id="admin" />
        <Input label="Admin password" name="password" type="password" id="password" />

        <button onKeyDown={(e:any)=>checkCredentials(e)}>Test</button>
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
          <AddOn manageAddOn={managetAddOn} />
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
