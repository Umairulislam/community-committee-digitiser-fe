/**
 * Design tokens — the single source of truth for all visual values.
 * Import from here rather than hard-coding values in components.
 */

export const colors = {
  // Brand
  primary: {
    main: '#1565C0',
    light: '#1E88E5',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00897B',
    light: '#26A69A',
    dark: '#00695C',
    contrastText: '#FFFFFF',
  },

  // Feedback
  success: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20' },
  warning: { main: '#ED6C02', light: '#FF9800', dark: '#E65100' },
  error:   { main: '#C62828', light: '#EF5350', dark: '#B71C1C' },
  info:    { main: '#0288D1', light: '#03A9F4', dark: '#01579B' },

  // Neutrals
  background: {
    default: '#F5F7FA',
    paper:   '#FFFFFF',
    subtle:  '#EDF0F5',
  },
  text: {
    primary:   '#1A1A2E',
    secondary: '#5A5F7A',
    disabled:  '#9EA3B5',
  },
  border: {
    default: '#DDE1EA',
    light:   '#EDF0F5',
    focus:   '#1565C0',
  },

  // Committee status colours (referenced in status chips/badges)
  status: {
    draft:     { bg: '#FFF8E1', text: '#7A5C00' },
    active:    { bg: '#E8F5E9', text: '#1B5E20' },
    paused:    { bg: '#FFF3E0', text: '#BF360C' },
    completed: { bg: '#E3F2FD', text: '#0D47A1' },
    cancelled: { bg: '#FFEBEE', text: '#B71C1C' },
  },

  // Contribution / payment status colours
  payment: {
    pending:  { bg: '#FFF8E1', text: '#7A5C00' },
    paid:     { bg: '#E8F5E9', text: '#1B5E20' },
    overdue:  { bg: '#FFEBEE', text: '#B71C1C' },
    verified: { bg: '#E3F2FD', text: '#0D47A1' },
  },
} as const;

export const spacing = {
  unit: 8,
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
} as const;

export const radii = {
  sm:  4,
  md:  8,
  lg:  12,
  xl:  16,
  full: 9999,
} as const;

export const shadows = {
  sm:  '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
  md:  '0 4px 6px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
  lg:  '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
  xl:  '0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)',
} as const;

export const typography = {
  fontFamily: `'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
  h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
  h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em' },
  h3: { fontSize: '1.5rem',   fontWeight: 600, lineHeight: 1.3,  letterSpacing: '-0.01em' },
  h4: { fontSize: '1.25rem',  fontWeight: 600, lineHeight: 1.35 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem',     fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem',  fontWeight: 500, lineHeight: 1.43 },
  body1:     { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6 },
  body2:     { fontSize: '0.875rem',  fontWeight: 400, lineHeight: 1.57 },
  caption:   { fontSize: '0.75rem',   fontWeight: 400, lineHeight: 1.5 },
  overline:  { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  button:    { fontSize: '0.875rem',  fontWeight: 600, lineHeight: 1.5,  letterSpacing: '0.02em', textTransform: 'none' as const },
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const zIndex = {
  appBar:   1100,
  drawer:    1200,
  modal:     1300,
  snackbar:  1400,
  tooltip:   1500,
} as const;

export const transitions = {
  fast:   '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow:   '350ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
