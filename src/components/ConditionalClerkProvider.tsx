"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ConditionalClerkProviderProps {
  children: ReactNode;
}

export default function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  // Check if Clerk publishable key exists
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // During build time or when no key is available, render without Clerk
  if (!publishableKey || typeof window === 'undefined') {
    return <>{children}</>;
  }

  // In browser with valid key, use Clerk
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
