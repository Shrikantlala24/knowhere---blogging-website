"use client";

import { useUser as useClerkUser } from '@clerk/nextjs';

export function useUser() {
  // Check if Clerk is available
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // During build time or when no key is available, return null user
  if (!publishableKey || typeof window === 'undefined') {
    return { 
      user: null, 
      isLoaded: true, 
      isSignedIn: false 
    };
  }

  // In browser with valid key, use Clerk
  try {
    return useClerkUser();
  } catch (error) {
    // Fallback if Clerk fails
    return { 
      user: null, 
      isLoaded: true, 
      isSignedIn: false 
    };
  }
}
