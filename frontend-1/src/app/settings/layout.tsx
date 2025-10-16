'use client';
import SimpleSideNavbar from './components/SideNavBar';
import { LoadingProvider, useLoading } from '../utils/LoadingContext';
import Loading from '../components/LoadingComponent';
import { Suspense } from 'react';

function AccountContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  return (
    <>
      {isLoading && <Loading />}
      <div className='min-h-screen flex bg-white'>
        <SimpleSideNavbar />
        <main className='lg:ml-4 sm:p-6 p-2 lg:p-8 w-full transition-all duration-300'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </main>
      </div>
    </>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <Suspense fallback={<Loading />}>
        <AccountContent>{children}</AccountContent>
      </Suspense>
    </LoadingProvider>
  );
}