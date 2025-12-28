import { useState } from 'react';

/**
 * Custom Hook für localStorage Synchronisation
 * @param {string} key - localStorage Key
 * @param {*} initialValue - Initaler Wert wenn Key nicht existiert
 * @returns {[value, setValue, removeValue]} - State, Setter, Remover
 */
export const useLocalStorage = (key, initialValue) => {
  // State für gespeicherten Wert
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wert in localStorage aktualisieren wenn sich State ändert
  const setValue = (value) => {
    try {
      // Erlaubt value als Funktion (wie setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Wert aus localStorage entfernen
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};
