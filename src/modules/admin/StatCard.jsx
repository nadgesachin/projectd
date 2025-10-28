import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'blue', subtitle }) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return TrendingUp;
    if (changeType === 'decrease') return TrendingDown;
    return Minus;
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  const getBackgroundColor = () => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500',
    };
    return colors[color] || colors.blue;
  };

  const ChangeIcon = getChangeIcon();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <ChangeIcon className={`w-4 h-4 ${getChangeColor()}`} />
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          )}
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${getBackgroundColor()} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${getBackgroundColor().replace('bg-', 'text-')}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

