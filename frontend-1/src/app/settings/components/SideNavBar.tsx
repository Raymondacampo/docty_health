// components/SimpleSideNavbar.tsx (Robust version)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const SimpleSideNavbar: React.FC = () => {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState<string>('my-account');
  const [isClient, setIsClient] = useState<boolean>(false);

  // Function to determine active page from path
  const getActivePageFromPath = (path: string): string => {
    if (path.includes('personal-data')) {
      return 'personal-data';
    } else if (path.includes('security')) {
      return 'security';
    }
    return 'my-account';
  };

  // Set client-side flag and initial state
  useEffect(() => {
    setIsClient(true);
    
    // Check current URL immediately on client-side mount
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const initialPage = getActivePageFromPath(currentPath);
      setActivePage(initialPage);
    }
  }, []);

  // Update active page when pathname changes
  useEffect(() => {
    if (isClient) {
      setActivePage(getActivePageFromPath(pathname));
    }
  }, [pathname, isClient]);

  const navItems: NavItem[] = [
    {
      id: 'my-account',
      label: 'My Account',
      href: '/account'
    },
    {
      id: 'personal-data',
      label: 'Personal Data',
      href: '/settings/personal-data'
    },
    {
      id: 'security',
      label: 'Security',
      href: '/settings/security'
    }
  ];

  // Don't render until client-side hydration to prevent flash
  if (!isClient) {
    return null;
  }

  return (
    <nav 
      className="hidden lg:block flex left-8 mt-[10vh] h-[90vh] w-76 bg-white z-40"
      style={{ top: '10vh' }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center px-4 py-3 rounded-sm text-sm  transition-colors duration-200 w-full border-b border-gray-200
                ${activePage === item.id 
                  ? 'bg-[#293241] font-bold text-white' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }
              `}
              onClick={() => setActivePage(item.id)}
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
              href={"/settings/doctor-settings"}
              className={`
                flex items-center px-4 py-3 rounded-sm text-sm  transition-colors duration-200 w-full border-b border-gray-200
                ${activePage === "doctor-settings" 
                  ? 'bg-[#293241] font-bold text-white' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }
              `}
              onClick={() => setActivePage("doctor-settings")}
            >
              <span>doctor settings</span>
            </Link>
        </div>
      </div>
    </nav>
  );
};

export default SimpleSideNavbar;