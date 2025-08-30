import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#10b981',
              colorBackground: '#000000',
              colorInputBackground: '#1f2937',
              colorInputText: '#ffffff',
              colorText: '#ffffff',
              colorTextSecondary: '#9ca3af',
              borderRadius: '0.5rem'
            },
            elements: {
              formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
              card: 'bg-gray-900 border border-gray-800',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'border-gray-700 text-white hover:bg-gray-800',
              formFieldLabel: 'text-white',
              formFieldInput: 'bg-gray-800 border-gray-700 text-white',
              footerActionLink: 'text-emerald-400 hover:text-emerald-300'
            }
          }}
        />
      </div>
    </div>
  )
}
