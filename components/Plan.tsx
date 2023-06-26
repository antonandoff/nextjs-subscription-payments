import { useEffect, useState } from 'react'
import { Database } from '@/types_db';
import { getActiveProductsWithPrices } from '@/app/supabase-server';

type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface Props {
  data?: any,
  id: any,
  addPlanToServer: any,
  removePlanFromServer: any
}

export default function Plan({data, id, addPlanToServer, removePlanFromServer}:Props) {
  const [isActive, setIsActive] = useState(false)
  const [isEditMode, setIsEditMode] = useState(true)
  const [features, setFeatures] = useState<any[]>([])
  const [planDetails, setPlanDetails] = useState<any[]>([])
  const [stripeSubscriptions, setStripeSubscriptions] = useState<any[]>([])
  const [planPrice, setPlanPrice] = useState<ProductWithPrices | any>()
  const [isSaved, setIsSaved] = useState(false)


  useEffect(()=>{
    // if we pass data, use that to populate the Plan
    // otherwise just load blank data
    if(data){
      prefilPlanForWhenInServerEditMode(data)
    } else {
      setPlanOptions()
    }
    
    
    getPricing()
  }, [])

  async function getPricing(){
    const pricingData =  await getActiveProductsWithPrices();
    // console.log(pricingData)
    const pricingDataWithPlans = pricingData.filter((item:any)=> item.metadata.type === 'plan');
    setStripeSubscriptions(pricingDataWithPlans)
  }

  function setPlanOptions(){
    const featureList = [
      {name: 'Extensions', value: 0, input: 'number', type:'extension'},
      {name: 'Auto Attendants', value: 0, input: 'number', type:'auto_attendant'},
      {name: 'Conference Rooms', value: 0, input: 'number', type:'conference_room'},
      {name: 'Ring Groups', value: 0, input: 'number', type:'ring_group'},
      {name: 'Call Queues', value: 0, input: 'number', type:'call_queue'},
      {name: 'Park Orbits', value: 0, input: 'number', type:'park_orbit'},
      {name: 'Calling Cards', value: 0, input: 'number', type:'calling_card'},
      {name: 'Paging Groups', value: 0, input: 'number', type:'paging_group'},
      {name: 'Service Flags', value: 0, input: 'number', type:'service_flag'},
      {name: 'IVR Nodes', value: 0, input: 'number', type:'ivr_node'},
      {name: 'Apps', value: false, input: 'checkbox'},
      {name: 'FAX', value: false, input: 'checkbox'},
      {name: 'SMS', value: false, input: 'checkbox'}
    ];

    setPlanDetails(featureList)
  }

  function togglePlanState () {
    const newValue = !isActive;
    setIsActive(newValue)
  }

  const toggleEditState = () => {
    const newValue = !isEditMode;
    setIsEditMode(newValue)
  }

  function onFormChange(e:any) {
    console.log(e)
  }

  function onInputChange(e:any) {
    // console.log(e.target.name, e.target.value, e.target.input)
    var newFeatureData = planDetails.map((item:any)=>item.name === e.target.name ? {...item, value: (item.input == 'number' ? e.target.value : e.target.checked)} : item)
    // console.log(newFeatureData)

    const z = newFeatureData.sort((a:any, b:any) => a - b)

    setPlanDetails(newFeatureData)
  }

  function selectPricePlan(e:any){
    if(e.target.value == 'default'){
      e.preventDefault()
    } else {
      setPlanPrice(JSON.parse(e.target.value))    
    }
  }

  const savePlan = () => {
    const planData = {
      id: planPrice.id,
      plan: planPrice,
      features: planDetails
    }

    setIsSaved(true)
    setIsEditMode(false)
    addPlanToServer(planData)
  }

  const prefilPlanForWhenInServerEditMode = async (data:any) => {    
    setIsActive(true)
    setIsEditMode(false)
    setPlanPrice(data.plan)
    setPlanDetails(data.features)
  }

  const removePlan = async (data: any) => {
    togglePlanState()
    removePlanFromServer({id:data.id})
    setIsSaved(false)
    setPlanOptions()
    setPlanPrice(null)
    setIsEditMode(true)
  }


  return <>
    <div className={!isSaved ? "w-full max-w-sm p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700" : "w-full max-w-sm p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-green-700"} style={{height: "fit-content"}}>
    {isActive ?  
      <div>     
          {isEditMode ? <div className=''>
            <div onChange={(e)=>onFormChange}>
            <div className="mb-6">
              <label htmlFor="serverCountry" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                <select onChange={(e)=>selectPricePlan(e)} id="serverCountry" style={{appearance: 'none'}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={JSON.stringify(planPrice)}>
                  <option value="default">Choose a subscription plan</option>
                  {stripeSubscriptions && stripeSubscriptions.map((data:any, index:any) => 
                    {
                      if(data.prices[0]) return <option key={index} value={JSON.stringify(data)}>{data.name}: {data?.prices[0]?.unit_amount / 100}/{(data?.prices[0]?.interval)}</option> ;                  
                    }                    
                  )}
                </select>
            </div>
            <div className='overflow-x-auto shadow-md sm:rounded-lg mb-10 dark:border-gray-600 border border-gray-900'>
            <table className="w-full text-sm text-gray-900 bg-gray-500 rounded-lg  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-3 text-left w-8/12">
                      Feature
                    </th>
                    <th scope="col" className="py-2 px-2 w-4/12">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {planDetails && planDetails.map((data:any, index:any)=>{
                    if(data.input == 'checkbox') {
                      return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-2 px-3 text-left">
                        {data.name}
                      </td>

                      <td className="py-2 px-2">                       
                        <input name={data.name} type={data.input} defaultValue={data.value} onChange={(e)=>onInputChange(e)} className="w-full m-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-1" checked={!!data.value} />  
                      </td>

                    </tr>
                    } else {
                    return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-2 px-3 text-left">
                        {data.name}
                      </td>

                      <td className="py-2 px-2">                       
                        <input name={data.name} type={data.input} defaultValue={data.value} onChange={(e)=>onInputChange(e)} className="w-full m-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-1" min={0}/>  
                      </td>

                    </tr>
                  }})}
                </tbody>
            </table>
            </div>
            </div>
          </div> :
          <>
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{planPrice?.name}</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-semibold">$</span>
                <span className="text-5xl font-extrabold tracking-tight">{planPrice?.prices[0]?.unit_amount / 100}</span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/{planPrice?.prices[0]?.interval}</span>
            </div>
          
            <ul role="list" className="space-y-5 my-7">
              {planDetails && planDetails.map((data:any, index:any)=> {
                var liClass, svgClass, textClass;
                if(data.value == 0 || data.value == false){
                  liClass = 'flex space-x-3 line-through decoration-gray-500'
                  svgClass = 'flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500'
                  textClass = 'text-base font-normal leading-tight text-gray-500'
                } else {
                  liClass = 'flex space-x-3'
                  svgClass = 'flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-500'
                  textClass = 'text-base font-normal leading-tight text-gray-500 dark:text-gray-400'
                }
                return <>
                  <li key={index} className={liClass}>
                    <svg aria-hidden="true" className={svgClass} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Check icon</title><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span className={textClass}>{data.value} {data.name}</span>
                  </li>
                </>
                }
              )}
               
            </ul>
          </>}
          <div>
            {!planPrice && 
            <p className='font-normal text-xs text-center text-red-700 dark:text-red-400 mb-5'> Select price plan to do any further actions </p>
            }
          </div>
          <div className="grid gap-6 md:grid-cols-1 mb-5">
            <button onClick={()=>toggleEditState()} type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center text-center">{isEditMode ? "Preview" : "Edit"}</button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <button type="button" onClick={()=>savePlan()} className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center text-center">Save</button>
            
            <button type="button" onClick={()=>{removePlan(data)}} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center text-center">Remove</button>          
          </div>
      </div> : <div onClick={()=>togglePlanState()}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
          <svg xmlns="http://www.w3.org/2000/svg" style={{width: '14px'}} viewBox="0 0 448 512" className="flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor">
            <path d="M432 256C432 269.3 421.3 280 408 280h-160v160c0 13.25-10.75 24.01-24 24.01S200 453.3 200 440v-160h-160c-13.25 0-24-10.74-24-23.99C16 242.8 26.75 232 40 232h160v-160c0-13.25 10.75-23.99 24-23.99S248 58.75 248 72v160h160C421.3 232 432 242.8 432 256z"/></svg>
          </div>

          <div>Add plan</div>
        </div>
      </div> }
    </div>
  </>
}