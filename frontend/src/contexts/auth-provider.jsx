import { useMemo, useState, useEffect, useCallback } from 'react';
// import axios, { endpoints } from '../utilities/axios';
import { AuthContext } from './auth-context';
import { setSession, isValidToken } from '../auth/utils';
import { STORAGE_KEY } from '../auth/constants';
import { signOut } from '../auth/actions';

const defaultState = {
  user: null,
  loading: true,
}

export function AuthProvider({ children }) {

  // Init default state
  const [state, setState] = useState(defaultState);

  const logOut = useCallback(() => {
    signOut()
    setState(defaultState)
  }, [setState])

  const checkUserSession = useCallback(async () => {
    try {
      // alert("CHECK")
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {

        setSession(accessToken)

        // In a production environment I would get a new token to keep the app alive as long as the user is using it.

        const userData = sessionStorage.getItem(`${STORAGE_KEY}-user`)

        if (userData) {
          setState({ user: JSON.parse(userData), loading: false });
        }

      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      // alert(error.message)
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //CHECK IS IS AUTHENTICATED

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  // CACHE THE DATA UNTIL Rrefreshed by a page
  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
          ...state.user,
          role: state.user?.role ?? 'ADMIN',
        }
        : null,
      checkUserSession,
      logOut,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
