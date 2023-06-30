'use client'

import { useState, useEffect } from 'react';
import { tenantDataFunction, serverDataFunction, subscriptionDataFunction } from './tenantFunction'
// import Layout from './layout';
// import Modal from 'react-modal';
// import Invoices from '@/components/Invoices';

interface Props {
 id: any
}

export default function TenantModalPage(props:Props) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [tenantData, setTenantData] = useState<any[]>([])
  const [serverData, setServerData] = useState<any[]>([])
  const [subscriptionData, setSubscriptionData] = useState<any[]>([])

  useEffect(()=>{
   
      init(props.id)
   
  }, [])

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const init = async (id:any) => {
    const tenant = await getTenantDataById(id)
    const server = await getServerDataById(tenant[0].server)
    const subscription = await getSubsciptionDataById(tenant[0].subscription_id)

    setTenantData(tenant)
    setServerData(server)
    setSubscriptionData(subscription)

    // console.log(tenant)
  }

  const getTenantDataById = async (id:any) => {
    const data = await tenantDataFunction(id)
    // console.log(data)
    // setTenantData(data)
    return data    
  }

  const getServerDataById = async (id:any) => {
    const data = await serverDataFunction(id)
    // console.log(data)
    // setServerData(data)
    return data
  }

  const getSubsciptionDataById = async (id:any) => {
    const data = await subscriptionDataFunction(id)
    // console.log(data)
    // setSubscriptionData(data)
    return data
  }

  return (<>
      <div className='grid gap-6 mb-6 grid-cols-3'>
        <div className="w-full max-w p-4 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Tenant</h5>
          <div>
            {/* {router.query.tenant} <br /> */}
            {/* product: {tenantData[0]?.product} <br /> */}
            {tenantData[0]?.domain?.name}.{tenantData[0]?.domain?.host} <br />
            
            {/* created: {tenantData[0]?.created_at} <br /> */}
            {/* updated: {tenantData[0]?.updated_at} <br /> */}
            {/* server: {tenantData[0]?.server} <br />
            subscription: {tenantData[0]?.subscription_id} <br /> */}
          </div>
        </div>

        <div className="w-full max-w p-4 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Server</h5>
          <div>
            {serverData[0]?.details?.name}<br />
            <p className='text-sm text-gray-500 dark:text-gray-400' >{serverData[0]?.details?.info}</p>
            {serverData[0]?.active ? 
              <span className='text-green-500'>Active</span> :
              <span className='text-red-500'>Inactive</span> }

 
            {/* id: {serverData[0]?.id}<br /> */}
          </div>
        </div>

        <div className="w-full max-w p-4 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Plan & Subscription</h5>
          <div>


          <table className="w-full text-sm text-gray-900 bg-gray-500 rounded-lg  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ">
                <tbody>
                {tenantData && tenantData[0]?.plan?.features?.map((data:any, index:any) => {
                    console.log(data)
                    if(data.input !== 'checkbox') {
                      return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="py-2 px-3 text-left">
                          {data.name}
                        </td>

                        <td className="py-1 px-0 text-center">  
                          {data.value}
                        </td>  
                      </tr>
                    } else {
                    return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-0 px-3 text-left">
                        {data.name}
                      </td>

                      <td className="py-1 px-0 text-center">                       
                        {(data.type == 'number' ? data.value : (data.value ? '✅' : '🚫'))}
                      </td>

                    </tr>
                  }})}
                </tbody>
            </table>
            {(tenantData[0]?.add_ons.length >= 1) && <p className='mt-5 text-lg text-gray-500 dark:text-gray-400'>Add-ons</p>}


          <table className="w-full text-sm text-gray-900 bg-gray-500 rounded-lg  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ">
                <tbody>
            {tenantData && tenantData[0]?.add_ons?.map((data:any, index:any) => {
              return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="py-0 px-3 text-left">
                {data.name}
              </td>

              <td className="py-1 px-0 text-center">                       
                {data.quantity}
              </td>

              </tr>
            })}
                </tbody>
            </table>
</div>
</div>
</div></>) }