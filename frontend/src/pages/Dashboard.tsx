import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        fontFamily: 'Nunito Sans, sans-serif',
        px: { xs: 4, md: 10 },
        pt: { xs: 8, md: 12 },
        pb: 10,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
      }}
    >
      {/* Left Side - Text and Button */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome back, {user?.name || 'Host'}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Track your bookings, expenses, and revenue in one place.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 3, borderRadius: 2, px: 4, py: 1.5, fontWeight: 600 }}
          onClick={() => navigate('/financials')}
        >
          View Your Financials
        </Button>
      </Box>

      {/* Right Side - Image */}
      <Box
        component="img"
        src="/assets/house.webp"
        alt="Modern house"
        sx={{
          width: { xs: '100%', md: '50%' },
          maxHeight: 450,
          objectFit: 'cover',
          borderRadius: 0,
          boxShadow: 'none',
        }}
      />
    </Box>
  );
};

export default Dashboard;
