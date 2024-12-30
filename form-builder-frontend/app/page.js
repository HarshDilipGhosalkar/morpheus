'use client'; // This ensures the component is treated as a client-side component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { isAuthenticated } from '../utils/auth'; // Assuming this is where you check auth status

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      // Redirect to admin forms if authenticated
      router.push('/admin');
    } else {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [router]);

  return null; // You can render a loading spinner or placeholder here if needed
}
