'use client';

import { createTheme } from '@mui/material/styles';
import { colors, radii, shadows, spacing, transitions, typography, zIndex } from './tokens';

/**
 * Central MUI theme — the single place for all global component customisation.
 * Import this theme into the ThemeProvider in the root layout.
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   colors.primary,
    secondary: colors.secondary,
    success:   colors.success,
    warning:   colors.warning,
    error:     colors.error,
    info:      colors.info,
    background: {
      default: colors.background.default,
      paper:   colors.background.paper,
    },
    text: {
      primary:  colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.border.default,
  },

  typography: {
    fontFamily: typography.fontFamily,
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    h5: typography.h5,
    h6: typography.h6,
    subtitle1: typography.subtitle1,
    subtitle2: typography.subtitle2,
    body1: typography.body1,
    body2: typography.body2,
    caption: typography.caption,
    overline: typography.overline,
    button: typography.button,
  },

  shape: {
    borderRadius: radii.md,
  },

  spacing: spacing.unit,

  shadows: [
    'none',
    shadows.sm,
    shadows.sm,
    shadows.md,
    shadows.md,
    shadows.lg,
    shadows.lg,
    shadows.lg,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
  ],

  zIndex: {
    appBar:  zIndex.appBar,
    drawer:  zIndex.drawer,
    modal:   zIndex.modal,
    snackbar: zIndex.snackbar,
    tooltip: zIndex.tooltip,
  },

  transitions: {
    duration: {
      shortest: 150,
      shorter:  200,
      short:    250,
      standard: 300,
      complex:  375,
      enteringScreen: 225,
      leavingScreen:  195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut:   'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
      sharp:     'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  components: {
    // ─── Button ────────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          transition: `background-color ${transitions.fast}, box-shadow ${transitions.fast}`,
          fontWeight: 600,
          letterSpacing: '0.01em',
        },
        sizeSmall: { padding: '4px 12px', fontSize: '0.8125rem' },
        sizeMedium: { padding: '8px 20px' },
        sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
        contained: {
          '&:hover': { boxShadow: shadows.sm },
        },
        outlined: {
          borderColor: colors.border.default,
          '&:hover': {
            borderColor: colors.primary.main,
            backgroundColor: 'rgba(82,40,204,0.04)',
          },
        },
        text: {
          '&:hover': { backgroundColor: 'rgba(82,40,204,0.06)' },
        },
      },
    },

    // ─── AppBar ────────────────────────────────────────────────────────────────
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          borderBottom: `1px solid ${colors.border.default}`,
          color: colors.text.primary,
        },
      },
    },

    // ─── Paper ─────────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: colors.border.default,
        },
      },
    },

    // ─── Card ──────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          border: `1px solid ${colors.border.default}`,
          boxShadow: shadows.sm,
          overflow: 'hidden',
        },
      },
    },

    // ─── TextField ─────────────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          '& fieldset': { borderColor: colors.border.default },
          '&:hover fieldset': { borderColor: colors.text.disabled },
          '&.Mui-focused fieldset': { borderColor: colors.primary.main, borderWidth: 2 },
        },
        input: {
          padding: '10px 14px',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': { color: colors.primary.main },
        },
      },
    },

    // ─── Chip ──────────────────────────────────────────────────────────────────
    MuiChip: {
      defaultProps: { size: 'small', variant: 'filled' },
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        sizeSmall: { height: 24 },
      },
    },

    // ─── Table ─────────────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.subtle,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.border.light}`,
          padding: '12px 16px',
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          color: colors.text.secondary,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': { borderBottom: 0 },
          '&:hover': { backgroundColor: colors.background.subtle },
        },
      },
    },

    // ─── Dialog ────────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radii.lg,
          boxShadow: shadows.xl,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1.125rem',
          paddingBottom: spacing.md,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: spacing.sm,
          paddingBottom: spacing.lg,
        },
      },
    },

    // ─── Drawer ────────────────────────────────────────────────────────────────
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.border.default}`,
        },
      },
    },

    // ─── Tabs ──────────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        indicator: {
          borderRadius: radii.full,
          height: 3,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          '&.Mui-selected': { color: colors.primary.main },
        },
      },
    },

    // ─── Alert ─────────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },

    // ─── Snackbar ──────────────────────────────────────────────────────────────
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': { borderRadius: radii.md },
        },
      },
    },

    // ─── Divider ───────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.border.default,
        },
      },
    },

    // ─── Tooltip ───────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.text.primary,
          fontSize: '0.75rem',
          borderRadius: radii.sm,
          padding: '6px 10px',
        },
        arrow: {
          color: colors.text.primary,
        },
      },
    },

    // ─── CircularProgress ──────────────────────────────────────────────────────
    MuiCircularProgress: {
      defaultProps: { size: 28, thickness: 4 },
    },

    // ─── LinearProgress ────────────────────────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: radii.full,
          height: 6,
        },
      },
    },

    // ─── Avatar ────────────────────────────────────────────────────────────────
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.light,
          color: colors.primary.contrastText,
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },

    // ─── Badge ─────────────────────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.625rem',
          height: 16,
          minWidth: 16,
          padding: '0 4px',
        },
      },
    },

    // ─── Link ──────────────────────────────────────────────────────────────────
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&:hover': { color: colors.primary.dark },
        },
      },
    },

    // ─── Skeleton ──────────────────────────────────────────────────────────────
    MuiSkeleton: {
      defaultProps: { animation: 'pulse', variant: 'rounded' },
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
        },
      },
    },
  },
});

export type AppTheme = typeof theme;
