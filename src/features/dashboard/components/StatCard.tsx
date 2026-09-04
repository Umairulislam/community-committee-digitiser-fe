'use client';

import { Box, Paper, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import { colors as tokensColors } from '@/theme/tokens';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: SvgIconComponent;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

/**
 * A card that displays a statistic with an icon.
 * Used for dashboard summary metrics.
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  loading = false,
}: StatCardProps) {
  const colorMap = {
    primary: tokensColors.primary.main,
    secondary: tokensColors.secondary.main,
    success: tokensColors.success.main,
    warning: tokensColors.warning.main,
    error: tokensColors.error.main,
    info: tokensColors.info.main,
  };

  const iconColor = colorMap[color];

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'action.hover',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 1, width: '60%' }} />
            <Box sx={{ height: 24, bgcolor: 'action.hover', borderRadius: 1, width: '40%' }} />
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${iconColor}14`,
            color: iconColor,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.5 }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
