/**
 * Centralized Utility to extract meaningful human-readable error messages from API responses.
 *
 * @param {Error|Object} error - Axios or standard Error object
 * @param {string} fallbackMessage - Optional default message if none could be extracted
 * @returns {string} Human-readable error message formatted for UI display
 */
export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred. Please try again.') => {
  if (!error) return fallbackMessage;

  // Handle direct string errors
  if (typeof error === 'string') return error;

  // 1. Check network / connection timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    return 'Request timeout. Please check your internet connection and try again.';
  }

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Network error. Please check your internet connection and try again.';
  }

  const responseData = error.response?.data;
  const statusCode = error.response?.status;

  if (responseData) {
    // 2. Standard MedFlow error payload format: { success: false, error: { message, details, code } }
    if (responseData.error) {
      if (typeof responseData.error === 'object') {
        const { message, details } = responseData.error;

        // If field-level validation errors exist in details
        if (details && typeof details === 'object' && !Array.isArray(details)) {
          const detailMessages = [];
          Object.entries(details).forEach(([field, msgs]) => {
            if (Array.isArray(msgs) && msgs.length > 0) {
              detailMessages.push(...msgs);
            } else if (typeof msgs === 'string') {
              detailMessages.push(msgs);
            }
          });

          if (detailMessages.length > 0) {
            return detailMessages.join('. ');
          }
        }

        if (message && typeof message === 'string') {
          return message;
        }
      } else if (typeof responseData.error === 'string') {
        return responseData.error;
      }
    }

    // 3. Fallback backend format: { success: false, message: "..." }
    if (responseData.message && typeof responseData.message === 'string') {
      return responseData.message;
    }
  }

  // 4. Server-side 500 errors without explicit data message
  if (statusCode >= 500) {
    return 'A server error occurred. Please try again later or contact support if the issue persists.';
  }

  // 5. Standard Error object message
  if (error.message && !error.message.includes('Request failed with status code')) {
    return error.message;
  }

  return fallbackMessage;
};
