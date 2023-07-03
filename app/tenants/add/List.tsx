'use client';

import { useEffect, useState } from 'react'
import { postData } from '@/utils/helpers';

import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { serversWithTenants } from './helperFunctions'

interface Props {
  user?: any
  data?: any
}

export default function List(props: Props) {


  useEffect(() => {
    // fetchPosts()
  }, [])
 
  return (<>
    <h1>List component</h1>
  </> );
}
