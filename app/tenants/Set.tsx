'use client';

import { useEffect, useState } from 'react'
import { postData } from '@/utils/helpers';

import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface Props {
  user?: any
  data?: any
}

export default function Set(props: Props) {


  useEffect(() => {
    // fetchPosts()
  }, [])
 
  return (<>
    <h1>Set component</h1>
  </> );
}
