// components/AppNavbar.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';

type Tab = 'appointments' | 'week' | 'schedules';

interface AppNavbarProps {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
}

export default function AppNavbar({ onTabChange, activeTab }: AppNavbarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'appointments', label: 'Appointments' },
    { id: 'week', label: 'Week Schedule' },
    { id: 'schedules', label: 'Schedules' },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}