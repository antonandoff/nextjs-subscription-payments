
"use client"

import { useState } from 'react';
import Plan from '@/components/plan/Plan'
import { features } from 'process';

export default function Form() {
  const [plans, setPlans] = useState([{ id: 1 }]);
  const [nextPlanId, setNextPlanId] = useState(2);

  const addPlan = () => {
    setPlans((prevPlans) => [...prevPlans, { id: nextPlanId }]);
    setNextPlanId((prevId) => prevId + 1);
  };

  const removePlan = (planId:any) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
  };

  // const handleSubmit = (event:any) => {
  //   event.preventDefault();

  //   console.log(event)
  //   // Access the form data including the plans array
  //   // ...

  //   // Do something with the form data
  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Get form data
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
  
    // Get plan values
    const planValues = featuresSet.map((feature) => {
      return {
        name: feature.name,
        value: feature.value,
        input: feature.input,
        type: feature.type,
      };
    });
  
    // Combine form data and plan values
    const allData = {
      ...formValues,
      plans: planValues,
    };
  
    // Log the data to the console or perform any other operations
    console.log('Form Data:', allData);
  };
  
  

  return ( 
    <form onSubmit={handleSubmit}>
      <input name="a"/>
      <input name="b"/>
      <input name="c"/>
      <input name="d"/>
      {/* Your other form inputs */}
      <div className="grid gap-6 mb-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id}>
          <Plan />
          <button type="button" onClick={() => removePlan(plan.id)}>Remove Plan</button>
        </div>
      ))}
        <div className="ring-1 ring-gray-200 rounded p-8">
          <button type="button" onClick={addPlan}>Add Plan</button>  
        </div>
      </div>  

      <button type="submit">Submit</button>    
    </form>
  );
};





