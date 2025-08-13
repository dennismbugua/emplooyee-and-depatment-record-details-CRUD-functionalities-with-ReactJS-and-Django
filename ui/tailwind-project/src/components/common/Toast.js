import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faExclamationTriangle, 
  faExclamationCircle, 
  faInfoCircle,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const Toast = ({ 
  type = 'info', 
  message, 
  onClose, 
  autoClose = true,
  duration = 5000,
  className = ''
}) => {
  const typeConfig = {
    success: {
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-400',
      textColor: 'text-emerald-300',
      icon: faCheck
    },
    error: {
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400',
      textColor: 'text-red-300',
      icon: faExclamationCircle
    },
    warning: {
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-300',
      icon: faExclamationTriangle
    },
    info: {
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-300',
      icon: faInfoCircle
    }
  };

  const config = typeConfig[type];

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  return (
    <div className={`
      fixed top-4 right-4 z-50 
      ${config.bgColor} ${config.borderColor} ${config.textColor}
      border backdrop-blur-lg rounded-lg p-4 
      shadow-lg transform transition-all duration-300
      ${className}
    `}>
      <div className="flex items-center space-x-3">
        <FontAwesomeIcon icon={config.icon} className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-70 transition-opacity"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
