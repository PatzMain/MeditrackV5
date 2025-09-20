import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/patients':
        return 'Patient Monitoring';
      case '/inventory':
        return 'Inventory Management';
      case '/archives':
        return 'Archives';
      case '/logs':
        return 'System Logs';
      default:
        return 'Meditrack';
    }
  };

  const getPageDescription = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Overview of system status and key metrics';
      case '/patients':
        return 'Monitor patient vital signs and status';
      case '/inventory':
        return 'Manage medical supplies and equipment';
      case '/archives':
        return 'Access historical records and data';
      case '/logs':
        return 'View system activity and audit trail';
      default:
        return 'Healthcare management system';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-medical-darkblue">
              {getPageTitle(location.pathname)}
            </h1>
            <p className="text-sm text-medical-darkgray mt-1">
              {getPageDescription(location.pathname)}
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-medical-darkgray hover:text-medical-darkblue transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM10.07 2.82l-.9.9a2 2 0 000 2.83l1.97 1.97-.53.53a1 1 0 000 1.42l1.42 1.42a1 1 0 001.42 0l.53-.53 1.97 1.97a2 2 0 002.83 0l.9-.9a2 2 0 000-2.83L15.58 6.39a2 2 0 00-2.83 0l-.9.9z"
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-medical-green text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-medical-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-green transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Quick Add
              </button>
            </div>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-medical-darkgray">System Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-medical-darkgray">Database Connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-medical-darkgray">3 Pending Alerts</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;