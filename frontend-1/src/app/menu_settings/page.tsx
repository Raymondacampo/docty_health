// app/account/menu-settings/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const MenuSettingsPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="pt-[10vh] flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Choose the section you want to manage
            </p>
          </div>
          
          {/* Navigation Menu */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 w-full shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                <span className="flex-1 text-left">{item.label}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          
          {/* Optional: Additional info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Select an option above to manage your account settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSettingsPage;