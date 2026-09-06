/**
 * Design tokens — the single source of truth for all visual values.
 * Import from here rather than hard-coding values in components.
 */

export const colors = {
  // Brand — Indigo (trust & community) + Emerald (growth & prosperity)
  primary: {
    main: '#5228CC',
    light: '#7C4DFF',
    dark: '#3A1D8F',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00A86B',
    light: '#2ECC87',
    dark: '#007A4D',
    contrastText: '#FFFFFF',
  },

  // Feedback
  success: { main: '#16A34A', light: '#4ADE80', dark: '#15803D' },
  warning: { main: '#F59E0B', light: '#FCD34D', dark: '#B45309' },
  error:   { main: '#EF4444', light: '#FCA5A5', dark: '#B91C1C' },
  info:    { main: '#3B82F6', light: '#93C5FD', dark: '#1E40AF' },

  // Neutrals — warmer undertone to complement indigo
  background: {
    default: '#FAFAFB',
    paper:   '#FFFFFF',
    subtle:  '#F3F1FA',
  },
  text: {
    primary:   '#1C1B2E',
    secondary: '#64617A',
    disabled:  '#A8A5B8',
  },
  border: {
    default: '#E5E2EF',
    light:   '#F3F1FA',
    focus:   '#5228CC',
  },

  // Committee status colours
  status: {
    draft:     { bg: '#FFF7ED', text: '#9A3412' },
    active:    { bg: '#ECFDF5', text: '#065F46' },
    paused:    { bg: '#FFFBEB', text: '#92400E' },
    completed: { bg: '#EEF2FF', text: '#3730A3' },
    cancelled: { bg: '#FEF2F2', text: '#991B1B' },
  },

  // Contribution / payment status colours
  payment: {
    pending:  { bg: '#FFFBEB', text: '#92400E' },
    paid:     { bg: '#ECFDF5', text: '#065F46' },
    overdue:  { bg: '#FEF2F2', text: '#991B1B' },
    verified: { bg: '#EEF2FF', text: '#3730A3' },
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
  h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
  h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2,  letterSpacing: '-0.015em' },
  h3: { fontSize: '1.5rem',   fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' },
  h4: { fontSize: '1.25rem',  fontWeight: 600, lineHeight: 1.3 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 },
  h6: { fontSize: '1rem',     fontWeight: 600, lineHeight: 1.35 },
  subtitle1: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.4 },
  subtitle2: { fontSize: '0.875rem',  fontWeight: 500, lineHeight: 1.35 },
  body1:     { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.5 },
  body2:     { fontSize: '0.875rem',  fontWeight: 400, lineHeight: 1.45 },
  caption:   { fontSize: '0.75rem',   fontWeight: 400, lineHeight: 1.4 },
  overline:  { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  button:    { fontSize: '0.875rem',  fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.02em', textTransform: 'none' as const },
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
