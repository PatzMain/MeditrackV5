import React from 'react';

const Archives: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-medical-darkblue mb-4">
          Archives
        </h2>
        <p className="text-medical-darkgray">
          Access historical patient records, treatment history, and archived medical data.
          Search and retrieve past medical information for compliance and reference.
        </p>

        <div className="mt-6 bg-medical-lightgreen rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 text-sm">
              <strong>Coming Soon:</strong> Comprehensive archive system with advanced search,
              data export capabilities, and compliance reporting features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archives;