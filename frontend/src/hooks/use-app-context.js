import { useContext } from 'react';
import { AppContext } from '../contexts/app-context';

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext: Context must be used inside AppProvider');
  }

  return context;
}
