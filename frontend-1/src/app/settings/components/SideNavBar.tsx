// components/SimpleSideNavbar.tsx (Robust version)
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiClient } from '@/app/utils/api';

interface NavItem {
  id: string;
  label: string;
  href: string;
  doc?: boolean;
}

const SimpleSideNavbar: React.FC = () => {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState<string>('my-account');
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    const checkDoctor = async () => {
      const response = await apiClient.get('/auth/me/');
      setIsClient(!response.data.is_doctor);
    };
    checkDoctor();
  }, []);

  // Function to determine active page from path
  const getActivePageFromPath = (path: string): string => {
    if (path.includes('personal-data')) {
      return 'personal-data';
    } else if (path.includes('security')) {
      return 'security';
    } else if (path.includes('doctor-settings')) {
      return 'doctor-settings';
    }else if (path.includes('appointment-system')) {
      return 'appointment-system';
    }
    return 'my-account';
  };

  // Set client-side flag and initial state
  useEffect(() => {    
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
      href: '/account',
      doc: false
    },
    {
      id: 'personal-data',
      label: 'Personal Data',
      href: '/settings/personal-data',
      doc: false
    },
    {
      id: 'security',
      label: 'Security',
      href: '/settings/security',
      doc: false
    },
    // {
    //   id: 'doctor-settings',
    //   label: 'Doctor Settings',
    //   href: '/settings/doctor-settings',
    //   doc: true
    // }
  ];


  return (
    <nav 
      className="lg:block flex left-8 mt-[10vh] h-[90vh] w-76 bg-white z-40"
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
          {!isClient && (
            <>
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
                <span>Doctor settings</span>
            </Link>     
                        <Link
                href={"/settings/appointment-system"}
                className={`
                  flex items-center px-4 py-3 rounded-sm text-sm  transition-colors duration-200 w-full border-b border-gray-200
                  ${activePage === "appointment-system" 
                    ? 'bg-[#293241] font-bold text-white' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }
                `}
                onClick={() => setActivePage("appointment-system")}
              >
                <span>Appointment system</span>
            </Link>       
            </>

          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleSideNavbar;