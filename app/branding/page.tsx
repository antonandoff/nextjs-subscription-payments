import { getSession } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import LogoUpload from './LogoUpload';
import FaviconUpload from './FaviconUpload';

export default async function Branding() {
  const [session ] = await Promise.all([getSession()]);
  if (!session) {
    return redirect('/signin');
  }

  const handleFaviconUpload = (file: File) => {
    // Implement the favicon upload logic here
    console.log('Uploading favicon:', file);
  };

  const handleLogoUpload = async (file: any) => {
    'use server'
    // Implement the logo upload logic here
    console.log('Uploading logo:', file);
  };



  return (<>
   <h1>I'm a branding page</h1>
   {/* <LogoUpload onUpload={handleFaviconUpload}/> */}

   <FaviconUpload fav={handleLogoUpload}/>
  
</>)
}
