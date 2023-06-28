'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function clearUrl(input: string) {
  const pattern = /^\/server\/([a-fA-F0-9-]+).*$/;

  const match = input.match(pattern);
  if (match) {
    const strippedUrl = `/server/${match[1]}`;
    return strippedUrl;
  }
}

export default function Nav(props: any) {
  const pathname = clearUrl(usePathname());

  return (
    <>
      <nav className="hidden ml-12 space-x-2 lg:block">
        <Link href={pathname + '/'}>Tenants</Link>
        <Link href={pathname + '/edit'}>Edit</Link>
        <Link href={pathname + '/manage'}>Manage</Link>
      </nav>
    </>
  );
}
