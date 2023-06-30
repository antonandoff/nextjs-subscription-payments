import { hashAndDigestPassword } from '@/utils/pbx'
import Plan from '@/components/plan/Plan';
import AddOn from '@/components/addon/AddOn';
import { useState, useEffect } from 'react';
import Router from 'next/router'
import {
 getRecord,
 updateRecord,
 createRecord} from './serverFunctions'

interface Props {
  id?: any
  userDetails?: any | null
}

interface Form {
  active?: boolean,
  add_ons?: any[],
  capacity?: string,
  created_at?: string,
  created_by?: string,
  details: Details,
  dns_address?: string, 
  id?: string,
  location: string,
  plans?: any[],
  status?: {},
  url?: string,
  version?: string,
  credentials?: {
    username?: string,
    password?: string
  }
}

interface Details {
  avatar?: string | '',
  info?: string | '',
  name?: string | ''
}

export default function ServersForm({id, userDetails}: Props) {
  // if props are present load the existing data for edits
  const [planList, setPlanList] = useState<any[]>([])
  const [addOnList, setAddOnList] = useState<any[]>([])
  const [adminPassword, setAdminPassword] = useState('')
  const [adminName, setAdminName] = useState('')
  const [pbxUrl, setPbxUrl] = useState('')
  const [isPlanAdded, setIsPlanAdded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authenticationMessage, setAuthenticationMessage] = useState('');
  const [existingServer, setExistingServer] = useState<any[]>([]) 
  const [mode, setMode] = useState('new')
  const [form, setForm] = useState<Form | any>({})



  useEffect(()=>{
    if(id){
      setMode('edit')
      prefilServerForm(id)      
    } 
  }, [])

  const addPlanToServer = (planData:any) => {
    // have to duplicate a value since it's immutable 
    var newPlanList = planList;

    // if exists based on Id, update, otherwise add to list
    if(planList.some((item:any)=> item.id == planData.id)){      
      newPlanList[newPlanList.findIndex((item:any) => item.id == planData.id)] = planData;
      setPlanList(newPlanList)
    } else{
      setPlanList(planList => [...planList, planData])
    }

    setIsPlanAdded(true)
  }

  const removePlanFromServer = (planData:any) => {    
    const newPlanList = planList.filter((item:any) => item.id !== planData.id )
    setPlanList(newPlanList)
  }

  const addAddOnToServer = (addOnData:any) => {
    if(addOnList.some((item:any)=> item.id == addOnData.id)){ 
      const newAddOnList = addOnList.filter((item:any) => item.id !== addOnData.id )
      setAddOnList(newAddOnList)
    } else{
      setAddOnList(addOnList => [...addOnList, addOnData])
    }
  }

  function updateFormValue<K extends keyof Form>(
    key: K,
    value: Form[K] | ((prevValue: Form[K]) => Form[K])
  ): void {    
    setForm((prevForm: Form) => {
      if (typeof value === "function") {
        return {
          ...prevForm,
          [key]: value(prevForm[key]),
        };
      }
      
      if (typeof prevForm[key] === "object" && typeof value === "object" && prevForm[key] !== null) {
        return {
          ...prevForm,
          [key]: {
            ...(prevForm[key] as object),
            ...(value as object),
          },
        };
      }
  
      return {
        ...prevForm,
        [key]: value,
      };
    });
  }
  
  const handleServerCreation = async (e: any) => {
    e.preventDefault();

    const data = {
      created_by: userDetails?.id,
        location: e.target.country.value,
        version: '',
        details: {
          name: e.target.name.value,
          avatar: '',
          info: e.target.info.value,
        },
        capacity: e.target.capacity.value,
        url: e.target.url.value,
        credentials: {
          username: e.target.admin.value,
          password: e.target.password.value
        },
        plans: planList,
        add_ons: addOnList,
        active: true,
        dns_address: e.target.dns_address.value
    }

    // Send the data to the server in JSON format.
    // const JSONdata = JSON.stringify(data)

    // if the Props id present means we are updating 
    if(id){
      await updateRecord(form, id)
    } else {
      const serverCreationRequest = await createRecord(data);
      if(serverCreationRequest?.error){
        console.log('😢 Server creation failed');    
        return
      } else {
        if(serverCreationRequest.id)
          Router.push(`/server/${serverCreationRequest.id}`)
      }
    }    
    // Router.reload()
  }

  const checkServerCredentials = async () => {
    // const hashedPassword = await hashAndDigestPassword(adminPassword);
    const hashedPassword = 'FIXME'
    const data = {
      username: adminName,
      password: hashedPassword
    }

    if(pbxUrl !== '' && adminName !== '' && adminPassword !== ''){
      const req = await fetch('/api/pbx/check-server-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({url:pbxUrl, username: adminName, password: hashedPassword}),
      })

      if (!req.ok) {
        console.log('😢 Server is unreachable or credentials are incorrect');    
        setAuthenticationMessage('😢 Oops. Please check if the url and credentials are correct')
      }

      const res = await req.json();

      if(res.session){
        setIsAuthenticated(true)

        return res
      }
    } else {
      console.log('some fields are empty')
    }
  }

  const prefilServerForm = async (id:any) => {
    const req = await getRecord(id);
    if(req.length > 0) {
      setForm(req[0])
      setPbxUrl(req[0].url)
      setPlanList(req[0].plans)
      setExistingServer(req)
    } else {
      Router.push('/servers')
    }
  }

  // Update stuff functions
  const updateServerDetails = async () => {
    const req = await updateRecord(form, id)
    // console.log(req)
  }

  const updateServerCredentials = async () => {
    if(adminName !== '' && adminPassword !== ''){
      const req = await checkServerCredentials()
      const hashedPassword = await hashAndDigestPassword(adminPassword);
      if(req.session){
        const data = { 
          credentials: {
            username: adminName,
            password: hashedPassword
          }
        }
        const req = await updateRecord(data, id)

        if(req){
          console.log('credentials updated successfully')
        } else {
          console.log('error updating credentials')
        }   
      } else {
        // show error message
        console.log('provided username and admin password are incorrect')
      }
    }
  }

  const updateServerPlans = async () => {
    const req = await updateRecord({'plans': planList}, id)
  }

  // last thing to do
  const updateServerAddOns = async (data:any) => {
    
  }

  return (<>
   <div className='mr-10 mb-10'>
    {/* <h3 className='ml-5 font-bold text-gray-500'>Server creation form</h3> */}
      <div className="">       
        <form onSubmit={handleServerCreation} className="">
          
          {/* Server details section */}
          <div>          
            <div className="mb-6">
              <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select country</label>
              <select onChange={(e)=>updateFormValue(e.target.name as any, e.target.value)} name="location" id="country" style={{appearance: 'none'}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={form?.location}>
                <option value="us">United States</option>
                <option value="de">Germany</option>
                <option value="au">Australia</option>
              </select>
            </div>
      
            <div className="mb-6">
              <label htmlFor="info" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Server description</label>
              <textarea onChange={(e)=>updateFormValue('details', {info: e.target.value})} name="info" id="info" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Server description" required defaultValue={form?.details?.info}></textarea>
            </div> 

            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Server name</label>
                    <input onChange={(e)=>updateFormValue('details', {name: e.target.value})}  type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""  defaultValue={form?.details?.name} required />
                </div>  
                <div>
                    <label htmlFor="support" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Suport link</label>
                    <input onChange={(e)=>updateFormValue(e.target.name as any, e.target.value)}  type="url" id="support" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
                </div>
                <div>
                    <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tenants capacity</label>
                    <input onChange={(e)=>updateFormValue(e.target.name as any, e.target.value)} name="capacity" type="number" id="capacity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" defaultValue={form?.capacity} required />
                </div>
                <div>
                    <label htmlFor="dns_address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Primary DNS zone </label>
                    <input onChange={(e)=>updateFormValue(e.target.name as any, e.target.value)}  name="dns_address" type="text" id="dns_address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" defaultValue={form?.dns_address} required />
                </div>
            </div>

            {/* Onnly show in the edit mode */}
            {mode == 'edit' && 
              <div onClick={()=>updateServerDetails()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer ">
                Update server details
              </div> 
            }
          </div>

          <div className="pl-2 relative flex py-5 items-center mb-2">
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          {/* Server connection section */}
          <div>
            <div className="mb-6">
                <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Server URL</label>
                <input onChange={e=>{setPbxUrl(e.currentTarget.value)}} type="url" id="url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" defaultValue={form?.url}  required />
            </div>
            
            <div className="mb-6">
                <label htmlFor="admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin</label>
                <input onChange={e=>{setAdminName(e.currentTarget.value)}} type="text" id="admin" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" defaultValue={form?.credentials?.username}  required />
            </div> 

            <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onChange={e=>{setAdminPassword(e.currentTarget.value)}}type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
            </div> 
            
            {mode == 'new' ? 
            <div onClick={()=>checkServerCredentials()} className={isAuthenticated ? "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer " : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer "}>
              {isAuthenticated ? "Authenticated" : (authenticationMessage == '' ?  "Validate credentials" : authenticationMessage)}
            </div> 
              :
            <div>
            <div onClick={()=>updateServerCredentials()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer ">
              Update admin and password
            </div> 
            </div>}
          </div>
     
          <div className="pl-2 relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="mb-6">
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Plans</label>
          </div>
          
          {/* Plans section */}
          {mode == 'new' &&
            <div className="grid gap-6 mb-6 md:grid-cols-3">

              {/* <Plan id={1} addPlanToServer={addPlanToServer} removePlanFromServer={removePlanFromServer}/>
              <Plan id={2} addPlanToServer={addPlanToServer} removePlanFromServer={removePlanFromServer}/>
              <Plan id={3} addPlanToServer={addPlanToServer} removePlanFromServer={removePlanFromServer}/>                     */}

            </div> 
          }
          {mode == 'edit' && 
            <div>
              <div className="grid gap-6 mb-6 md:grid-cols-3">
                {form && form?.plans?.map((plan:any, index:any) => {
                  // key {index} throws an error, somehow key doesn't like to be 0
                  // addPlantToTheServer={LOCAL_FUNCTION}
                  return <>
                  {/* <Plan data={plan} key={index + 1} id={index} addPlanToServer={addPlanToServer} removePlanFromServer={removePlanFromServer} />  */}
                  </>
                })}
                
                {/* If there are less than 3 plans, displays the placehoders */}
                {form?.plans?.length < 3 && (
                  Array.from({ length: 3 - form.plans.length }).map((_, index) => (
                   <></>
                    // <Plan key={index} id={index} addPlanToServer={addPlanToServer} removePlanFromServer={removePlanFromServer} />                    
                  ))
                )}
              </div>

              <div onClick={()=>updateServerPlans()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer ">
                Update plans
              </div>
            </div>
        }

          <div className="pl-2 relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
          </div>


          <div className="mb-6">
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Add-ons</label>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">
            {/* <AddOn id={1} addAddOnToServer={addAddOnToServer}/> */}
          </div>

          {mode == 'new' &&
            <button type="submit" className={(isAuthenticated && isPlanAdded) == false ? 'text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer mb-10' : 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer mb-10'} disabled={((isAuthenticated && isPlanAdded) == false ? true : false)}>
              {id ? 'Update' : 'Submit'}  
            </button>            
          }   
          {/* <button type="submit"> test</button> */}

          {mode == 'edit' && 
            <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer mb-10'>
             Update Add-ons
           </button>
          }   
    
          {mode !== 'edit' && !isPlanAdded &&  <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-600 dark:text-red-400" role="alert">Add at least one plan to this server</div>}
          
          {mode !== 'edit' && !isAuthenticated && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-600 dark:text-red-400" role="alert">
            Authenticate with PBX
          </div>}          
      </form>
    </div>
  </div>
  </>)
}