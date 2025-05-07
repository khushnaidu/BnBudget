import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const Financials: React.FC = () => {
  const { user } = useAuth();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const res = await axios.post(API_ENDPOINTS.metabaseDashboard, {
          email: user?.email,
        });
        setIframeUrl(res.data.iframe_url);
      } catch (err) {
        console.error('Failed to fetch Metabase URL:', err);
        setError('Unable to load financial dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 8 },
        pt: 6,
        pb: 10,
        fontFamily: 'Nunito Sans, sans-serif',
      }}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Your Financial Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Explore real-time insights across your Airbnb portfolio.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          component="iframe"
          src={iframeUrl || ''}
          sx={{
            width: '100%',
            height: '80vh',
            border: 'none',
            borderRadius: 3,
            boxShadow: 4,
          }}
        />
      )}
    </Box>
  );
};

export default Financials;
