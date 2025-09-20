import React from 'react';

const Inventory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-medical-darkblue mb-4">
          Inventory Management
        </h2>
        <p className="text-medical-darkgray">
          Manage medical supplies, equipment, and pharmaceutical inventory.
          Track stock levels, expiration dates, and automate reordering processes.
        </p>

        <div className="mt-6 bg-medical-lightgreen rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 text-sm">
              <strong>Coming Soon:</strong> Complete inventory management system with barcode scanning,
              automated alerts for low stock, and supplier integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;