import { APP_CONSTANTS } from '../constants';

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate days since joining
 * @param {string} joinDate - Join date string
 * @returns {number} Number of days
 */
export const calculateDaysSinceJoining = (joinDate) => {
  if (!joinDate) return 0;
  const join = new Date(joinDate);
  const today = new Date();
  const diffTime = Math.abs(today - join);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Generate random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Filter array by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered array
 */
export const filterBySearch = (array, searchTerm, searchFields) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => 
    searchFields.some(field => 
      item[field] && item[field].toString().toLowerCase().includes(term)
    )
  );
};

/**
 * Sort array by field
 * @param {Array} array - Array to sort
 * @param {string} field - Field to sort by
 * @param {boolean} ascending - Sort order
 * @returns {Array} Sorted array
 */
export const sortByField = (array, field, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (ascending) {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
    }
  });
};

/**
 * Get image URL with fallback
 * @param {string} filename - Image filename
 * @param {string} baseUrl - Base URL for images
 * @returns {string} Full image URL
 */
export const getImageUrl = (filename, baseUrl) => {
  if (!filename) return `${baseUrl}${APP_CONSTANTS.DEFAULT_PHOTO}`;
  return `${baseUrl}${filename}`;
};
