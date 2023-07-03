'use client';

import PlanEdit from './PlanEdit';
import PlanView from './PlanView';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import {getActiveProductsWithPrices} from '@/app/supabase-server';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  data?: any;
  addPlanToServer?: any;
  removePlanFromServer?: any;
  formSubmit?:any;
}

const set = [
  { name: 'Extensions', value: 0, input: 'number', type: 'extension' },
  {
    name: 'Auto Attendants',
    value: 0,
    input: 'number',
    type: 'auto_attendant'
  },
  {
    name: 'Conference Rooms',
    value: 0,
    input: 'number',
    type: 'conference_room'
  },
  { name: 'Ring Groups', value: 0, input: 'number', type: 'ring_group' },
  { name: 'Call Queues', value: 0, input: 'number', type: 'call_queue' },
  { name: 'Park Orbits', value: 0, input: 'number', type: 'park_orbit' },
  { name: 'Calling Cards', value: 0, input: 'number', type: 'calling_card' },
  { name: 'Paging Groups', value: 0, input: 'number', type: 'paging_group' },
  { name: 'Service Flags', value: 0, input: 'number', type: 'service_flag' },
  { name: 'IVR Nodes', value: 0, input: 'number', type: 'ivr_node' }
];

interface Metadata {
  type: string;
}

interface SubscriptionPrice {
  id: string;
  product_id: string;
  active: boolean;
  description: string | null;
  unit_amount: number;
  currency: string;
  type: string;
  interval: string;
  interval_count: number;
  trial_period_days: number | null;
  metadata: Metadata;
}

interface Plan {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
  image: string | null;
  metadata: Metadata;
  prices: SubscriptionPrice[];
}

interface Feature {
  name: string;
  value: number;
  input: string;
  type: string;
}


export default function Plan(props: Props) {
  const [mode, setMode] = useState('');
  const [featuresSet, setFeaturesSet] = useState([...set]);
  const [plan, setPlan] = useState<Plan>()
  const data = props.data;
  
  useEffect(() => {
    if(props.data){
      setMode('user')
      setFeaturesSet(props.data.features)
      setPlan(props.data.plan)
    } else {
      setMode(data.view)
      if(plan && featuresSet)
        props.formSubmit(data.id, plan, featuresSet)
    }
  },[plan, featuresSet])

  const handleFeatureChange = (featureType: string, newValue: number) => {
    setFeaturesSet((prevFeaturesSet) =>
      prevFeaturesSet.map((feature) =>
        feature.type === featureType ? { ...feature, value: newValue } : feature
      )
    );
  };

  const handlePlanChange = (newValue: any) => {
    setPlan(newValue);
  }

  const deletePlan = (planType: string) => {
    setFeaturesSet((prevFeaturesSet) =>
      prevFeaturesSet.filter((feature) => feature.type !== planType)
    );
  };

  return (
    <>
      <div>
        {(mode == 'user' || mode == 'view') && <PlanView data={data} features={featuresSet} plan={plan} key={data.id} />}
        {mode == 'edit' && <PlanEdit data={data} features={featuresSet} plan={plan} onFeatureChange={handleFeatureChange} onPlanChange={handlePlanChange} key={data.id}/>}

        {mode !== 'user' &&  <div className="mt-4 mb-16 h-9">
          <RadioGroup value={mode} onChange={setMode}
            className="grid grid-cols-2 gap-x-1 rounded p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Option key={'view'} value={'view'}
              className={({ checked }) =>
                classNames(
                  checked ? 'bg-indigo-600 text-white' : 'text-gray-500',
                  'cursor-pointer rounded px-2.5 py-1'
                )
              }
            >
              <span>Preview</span>
            </RadioGroup.Option>

            <RadioGroup.Option key={'edit'} value={'edit'} className={({ checked }) =>
                classNames(
                  checked ? 'bg-indigo-600 text-white' : 'text-gray-500',
                  'cursor-pointer rounded px-2.5 py-1'
                )
              }
            >
              <span>Edit</span>
            </RadioGroup.Option>
          </RadioGroup>
        </div> }
      </div>
    </>
  );
}
