import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue-500', 
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <FontAwesomeIcon 
        icon={faSpinner} 
        className={`${sizeClasses[size]} text-${color} animate-spin`}
      />
      {text && (
        <span className="text-white/70">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
