import React from 'react';

const Loader = ({
  size = 'md',
  color = 'primary',
  text = '',
  fullScreen = false,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Color classes
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  // Spinner component
  const Spinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Dots loader
  const DotsLoader = () => (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-current animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${sizeClasses[size]} rounded-full bg-current animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${sizeClasses[size]} rounded-full bg-current animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  // Pulse loader
  const PulseLoader = () => (
    <div className={`${sizeClasses[size]} rounded-full bg-current animate-pulse ${className}`} />
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <Spinner />
          {text && (
            <p className="mt-4 text-sm text-gray-600">{text}</p>
          )}
        </div>
      </div>
    );
  }

  // Inline loader
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <Spinner />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({
  lines = 3,
  className = '',
}) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`h-4 bg-gray-200 rounded mb-2 ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Card skeleton loader
export const CardSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 bg-gray-300 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
      </div>
    </div>
  </div>
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-300 rounded flex-1" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 p-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Loader;
