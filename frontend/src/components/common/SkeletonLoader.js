import React from 'react';

/**
 * Skeleton Loader Component für bessere UX während des Ladens
 * @param {string} type - 'card', 'list', 'transaction', 'balance'
 * @param {number} count - Anzahl der Skeleton Items (nur für list/transaction)
 */
const SkeletonLoader = ({ type = 'list', count = 5 }) => {
  
  // Balance Card Skeleton
  if (type === 'balance') {
    return (
      <div className="bg-white rounded-[30px] w-[90%] mx-auto shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] lg:w-[95%] animate-pulse">
        <section className="pt-6 lg:pt-10">
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-6 lg:h-7"></div>
          <div className="h-10 bg-gray-300 rounded w-48 mx-auto mb-4 lg:h-12"></div>
        </section>
        
        <div className="flex justify-evenly mx-auto pb-4 px-6 lg:pb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 lg:w-16 lg:h-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 lg:w-16 lg:h-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 lg:w-16 lg:h-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>

        <div className="px-[5%] py-2 lg:px-8">
          <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
        </div>

        <div className="overflow-auto h-[40vh] lg:h-[35vh] px-[3%] lg:px-8 space-y-4">
          {[...Array(count)].map((_, index) => (
            <TransactionSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Home Balance Card Skeleton
  if (type === 'card') {
    return (
      <div className="bg-darkBlue rounded-[20px] p-[5%] w-[90%] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.245)] animate-pulse lg:p-8 lg:w-[95%]">
        <div className="flex items-center pb-2 lg:pb-4">
          <div className="h-5 bg-white/20 rounded w-32 mr-2 lg:h-6"></div>
          <div className="w-4 h-4 bg-white/20 rounded"></div>
        </div>
        
        <div className="h-10 bg-white/30 rounded w-36 mb-6 lg:h-12 lg:mb-8"></div>
        
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 lg:mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="h-4 bg-white/20 rounded w-16 lg:h-5"></div>
            </div>
            <div className="h-5 bg-white/30 rounded w-20 lg:h-6"></div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 lg:mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="h-4 bg-white/20 rounded w-16 lg:h-5"></div>
            </div>
            <div className="h-5 bg-white/30 rounded w-20 lg:h-6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Transaction List Skeleton
  if (type === 'transaction' || type === 'list') {
    return (
      <div className="space-y-4 px-[5%] lg:px-8">
        {[...Array(count)].map((_, index) => (
          <TransactionSkeleton key={index} />
        ))}
      </div>
    );
  }

  return null;
};

// Transaction Item Skeleton
const TransactionSkeleton = () => (
  <div className="flex justify-between items-center py-3 animate-pulse">
    <div className="flex items-center">
      <div className="w-[45px] h-[45px] bg-gray-200 rounded-[10px] mr-3 lg:w-[55px] lg:h-[55px]"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2 lg:h-5 lg:w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-20 lg:h-4 lg:w-24"></div>
      </div>
    </div>
    <div className="h-5 bg-gray-200 rounded w-16 lg:h-6 lg:w-20"></div>
  </div>
);

export default SkeletonLoader;
