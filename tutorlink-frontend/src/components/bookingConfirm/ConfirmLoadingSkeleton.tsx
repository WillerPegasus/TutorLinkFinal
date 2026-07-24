// ============================================================
// Skeleton de chargement affiché pendant la récupération
// de la réservation depuis l'API (cas rafraîchissement page)
// ============================================================

import React from "react";

const ConfirmLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#eef2f7] flex items-center
                    justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg
                      overflow-hidden animate-pulse">

        {/* Bannière skeleton */}
        <div className="bg-gray-300 h-48" />

        {/* Référence skeleton */}
        <div className="bg-gray-100 px-8 py-3 flex justify-center">
          <div className="h-4 w-32 bg-gray-300 rounded-full" />
        </div>

        {/* Corps skeleton */}
        <div className="px-8 py-6 space-y-4">
          {/* Tutor card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50
                          rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gray-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 bg-gray-300 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>

          {/* Alerts */}
          <div className="h-20 bg-amber-50 rounded-xl" />
          <div className="h-16 bg-blue-50 rounded-xl" />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-gray-300 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLoadingSkeleton;