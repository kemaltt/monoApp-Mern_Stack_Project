/**
 * Clean error messages by removing "Error:" prefix
 * @param {string} message - The error message to clean
 * @returns {string} - Cleaned error message
 */
export const cleanErrorMessage = (message) => {
  if (!message) return '';
  return message.replace(/^Error:\s*/i, '');
};

/**
 * Extract error message from API response
 * @param {Object} response - API error response
 * @returns {string} - Cleaned error message
 */
export const getErrorMessage = (response) => {
  const message = response?.error?.data?.message || 'An error occurred';
  return cleanErrorMessage(message);
};
