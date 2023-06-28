import {
  getSession,
  getServers,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import ServersForm from '../ServerForm'
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import Plan from '@/components/plan/Plan';
import PlanNew from '@/components/PlanNew'

const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    price: { monthly: '$15', annually: '$144' },
    description: 'The essentials to provide your best work for clients.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics'],
    mostPopular: false,
  },
  {
    name: 'Freelancer',
    id: 'tier-freelancer',
    href: '#',
    price: { monthly: '$30', annually: '$288' },
    description: 'The essentials to provide your best work for clients.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
    mostPopular: false,
  },
  {
    name: 'Startup',
    id: 'tier-startup',
    href: '#',
    price: { monthly: '$60', annually: '$576' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Marketing automations',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    price: { monthly: '$90', annually: '$864' },
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      '1-hour, dedicated support response time',
      'Marketing automations',
      'Custom reporting tools',
    ],
    mostPopular: false,
  },
]

export default async function Servers() {
  const [session, servers] = await Promise.all([
    getSession(),
    getServers()
  ]);

  
  if (!session) {
    return redirect('/signin');
  }

  const addPlanToServer = async (data:any) => {
    'use server'
    console.log(data)
  }

  const removePlanFromServer = async (data:any) => {    
    'use server'
    console.log(data)
  }

  return (<> 
    <h1>Add server page</h1>  
    <div className="grid gap-6 mb-6 md:grid-cols-3">
    {tiers && tiers.map((data:any) => (
      <Plan data={data} addPlanToServer={addPlanToServer} removePlanFromServer={removePlanFromServer} />
    ))} 
    </div>
    </>
  );
}
