'use client'

import Link from 'next/link';

import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
// import { usePathname } from 'next/navigation'
 
export default function Nav(props:any) {
  const pathname = usePathname()
 console.log
  return (<>
  {/* {router} */}
  <nav className="hidden ml-12 space-x-2 lg:block">
              <Link href={pathname + '/'}>
                Overview
              </Link>
              <Link href={pathname + '/edit'}>
                Edit
              </Link>

              </nav>
    {/* <p>Current pathname: {pathname}</p> */}
    </>
  )
}