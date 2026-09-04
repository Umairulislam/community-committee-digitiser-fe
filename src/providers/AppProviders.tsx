'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { makeStore } from '@/store';
import type { AppStore } from '@/store';
import { theme } from '@/theme/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Wraps the application with Redux store and MUI theme providers.
 * The store instance is created once per component lifetime using a ref
 * to survive React StrictMode double-mounting in development.
 */
export function AppProviders({ children }: AppProvidersProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
