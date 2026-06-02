import React from 'react';

const MessagesSkeleton = () => {
  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r p-4">
        <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="w-3/4 p-4 flex flex-col">
        <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="flex-grow space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 ml-auto animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded mt-4 animate-pulse"></div>
      </div>
    </div>
  );
};

export default MessagesSkeleton;
