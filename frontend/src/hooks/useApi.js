import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Custom Hook für API Calls mit automatischem State Management
 * @param {Function} apiFunction - Die API Funktion die aufgerufen werden soll
 * @param {Object} options - Optionen für den Hook
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Success!',
    onSuccess = null,
    onError = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Call ausführen
  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);

        // Handle RTK Query Response
        if (response.error) {
          const errorMsg = getErrorMessage(response);
          setError(errorMsg);
          
          if (showErrorToast) {
            toast.error(errorMsg);
          }
          
          if (onError) {
            onError(response.error);
          }
          
          return { success: false, error: response.error };
        }

        // Success
        setData(response.data);
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(response.data);
        }

        return { success: true, data: response.data };
      } catch (err) {
        const errorMsg = err.message || 'An unexpected error occurred';
        setError(errorMsg);
        
        if (showErrorToast) {
          toast.error(errorMsg);
        }
        
        if (onError) {
          onError(err);
        }
        
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showSuccessToast, showErrorToast, successMessage, onSuccess, onError]
  );

  // State zurücksetzen
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};
