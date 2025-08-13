import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 
      text-white shadow-lg hover:shadow-xl
      hover:from-blue-500 hover:to-purple-500
      focus:ring-blue-500
    `,
    secondary: `
      bg-gray-700 text-white border border-gray-600
      hover:bg-gray-600 hover:border-gray-500
      focus:ring-gray-500
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-green-600
      text-white shadow-lg hover:shadow-xl
      hover:from-emerald-500 hover:to-green-500
      focus:ring-emerald-500
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-pink-600
      text-white shadow-lg hover:shadow-xl
      hover:from-red-500 hover:to-pink-500
      focus:ring-red-500
    `,
    warning: `
      bg-gradient-to-r from-yellow-600 to-orange-600
      text-white shadow-lg hover:shadow-xl
      hover:from-yellow-500 hover:to-orange-500
      focus:ring-yellow-500
    `,
    outline: `
      border-2 border-blue-500 text-blue-400
      hover:bg-blue-500 hover:text-white
      focus:ring-blue-500
    `,
    ghost: `
      text-gray-300 hover:text-white
      hover:bg-gray-800
      focus:ring-gray-500
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm', 
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5', 
    xl: 'w-6 h-6'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const renderIcon = () => {
    if (!icon) return null;
    
    return React.cloneElement(icon, {
      className: `${iconSizes[size]} ${
        iconPosition === 'right' ? 'ml-2' : 'mr-2'
      }`
    });
  };

  const renderChildren = () => {
    if (loading) {
      return (
        <>
          <div className={`animate-spin rounded-full border-2 border-white/30 border-t-white ${iconSizes[size]} mr-2`} />
          Loading...
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderChildren()}
    </button>
  );
};

export default Button;
