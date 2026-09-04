import { Box, Button, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
        p: 4,
        textAlign: 'center',
      }}
    >
      <SearchOffIcon color="disabled" sx={{ fontSize: 64 }} />
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Page not found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        The page you are looking for does not exist or may have been moved.
      </Typography>
      <Button variant="contained" component="a" href="/" sx={{ mt: 1 }}>
        Go to Home
      </Button>
    </Box>
  );
}
