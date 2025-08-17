import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  authenticated: false,
  unauthenticated: true,
  
  // This one will help me check session on Task Page
  checkUserSession: () => {},
  logOut: () => {}
});

export const AuthConsumer = AuthContext.Consumer;