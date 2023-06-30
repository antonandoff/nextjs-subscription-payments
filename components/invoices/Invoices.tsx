import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
 id?: any
}

export default function Invocies(props:Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  useEffect(()=>{
    retrieveSubscriptionInvoices(props.id)
  }, [])
  

  async function retrieveSubscriptionInvoices (subscriptionId:any) {
    if(!subscriptionId){
      router.push('/licenses')
    }
    const data = {
      subscription: subscriptionId
    }
    try {
      const req = await fetch('/api/subscription-invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const res =  await req.json();
      // console.log(res.invoices.data)
      setInvoices(res.invoices.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    } finally { 
      // console.log('success')
    }
  }

  function unixToDate (unix:any) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(unix*1000);

    return formattedDate;
  }

  return (<>
      <h3>Invoices</h3>
      {isLoading ? <div>Loading</div> : <>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                {/* <th scope="col" className="p-4">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </th> */}
                <th scope="col" className="py-3 px-6">
                    Invoice Number
                </th>
                <th scope="col" className="py-3 px-6">
                    Status
                </th>
                <th scope="col" className="py-3 px-6">
                    Period
                </th>
                <th scope="col" className="py-3 px-6">
                    Amount
                </th>          
                {/* <th scope="col" className="py-3 px-6">
                    Created at
                </th> */}
                <th scope="col" className="py-3 px-6" style={{textAlign: 'center'}}>
                    Invoice
                </th>

                <th scope="col" className="py-3 px-6" style={{textAlign: 'center'}}>
                    Details
                </th>
            </tr>
        </thead>
        <tbody>
      {invoices && invoices.map((data:any, index:any)=>
        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          {/* <td className="p-4 w-4">
            <div className="flex items-center">
              <input id={"checkbox-table-search-" + index} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={"checkbox-table-search-" + index} className="sr-only">checkbox</label>
            </div>
          </td> */}

          <td className="py-4 px-6">
            {data.number}
          </td>

          <td className="py-4 px-6">
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
              {data.status}
            </div>
          </td>

          <td className="py-4 px-6">
            {unixToDate(data.period_start)} - {unixToDate(data.period_end)}
          </td>

          <td className="py-4 px-6">
            {/* {data.currency}  */}
            $
            {(data.subtotal)/100}
          </td>

          <td className="py-4 px-6">
            <Link href={data.invoice_pdf} className="text-blue-700">              
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{width: '20px', display: 'block', margin: 'auto'}}>
              <path fill="rgb(29 78 216)" d="M448 304h-53.5l-48 48H448c8.822 0 16 7.178 16 16V448c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16v-80C48 359.2 55.18 352 64 352h101.5l-48-48H64c-35.35 0-64 28.65-64 64V448c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64v-80C512 332.7 483.3 304 448 304zM432 408c0-13.26-10.75-24-24-24S384 394.7 384 408c0 13.25 10.75 24 24 24S432 421.3 432 408zM239 368.1C243.7 373.7 249.8 376 256 376s12.28-2.344 16.97-7.031l136-136c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L280 294.1V24C280 10.75 269.3 0 256 0S232 10.75 232 24v270.1L136.1 199c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L239 368.1z"/></svg>
            </Link>
          </td>

          <td className="py-4 px-6">
            <Link href={data.hosted_invoice_url} target="_blank">
              
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{width: '20px', display: 'block', margin: 'auto'}}>
                <path fill="rgb(29 78 216)" d="M304 24c0 13.3 10.7 24 24 24H430.1L207 271c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l223-223V184c0 13.3 10.7 24 24 24s24-10.7 24-24V24c0-13.3-10.7-24-24-24H328c-13.3 0-24 10.7-24 24zM72 32C32.2 32 0 64.2 0 104V440c0 39.8 32.2 72 72 72H408c39.8 0 72-32.2 72-72V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V440c0 13.3-10.7 24-24 24H72c-13.3 0-24-10.7-24-24V104c0-13.3 10.7-24 24-24H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H72z"/></svg>
              
            </Link>
          </td>

        {/* <li>{data.invoice_pdf}</li> */}

        </tr>
      )}
      </tbody>
      </table>
      </div>
      </>}
      

      
    </>
  );
}
