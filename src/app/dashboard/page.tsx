'use client';

import { useRouter } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth, useLogoutMutation } from '@/features/auth';
import { clearUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { getInitials } from '@/utils';
import Loading from '@/app/loading';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAuth();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearUser());
      router.push('/login');
    }
  };

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Committee Digitiser
          </Typography>
          <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.8rem' }}>
            {getInitials(user.name)}
          </Avatar>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {user.name}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ textTransform: 'none', fontSize: '0.875rem' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome, {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You are signed in as <strong>{user.email}</strong> ({user.role}).
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary">
            Dashboard features will be implemented in Phase 3.
          </Typography>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="outlined" onClick={handleLogout}>
            Sign Out
          </Button>
        </Box>
      </Container>
    </>
  );
}
