import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

/**
 * Custom Hook für Authentication Management
 * Vereinfacht Token-Handling und Authentifizierungs-Logik
 */
export const useAuth = () => {
  const { token, saveToken, removeToken } = useAppContext();
  const navigate = useNavigate();
  const intl = useIntl();

  // Check ob User eingeloggt ist
  const isAuthenticated = !!token;

  // Login Funktion
  const login = (accessToken, redirectTo = '/home') => {
    saveToken(accessToken);
    toast.success(intl.formatMessage({ id: 'auth.loginSuccess' }));
    setTimeout(() => {
      navigate(redirectTo);
    }, 500);
  };

  // Logout Funktion
  const logout = (redirectTo = '/login') => {
    removeToken();
    toast.info(intl.formatMessage({ id: 'auth.logoutSuccess' }));
    navigate(redirectTo);
  };

  // Token aus localStorage holen
  const getToken = () => token;

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getToken,
    saveToken,
    removeToken,
  };
};
