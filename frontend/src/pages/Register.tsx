// src/pages/auth/Register.tsx

import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await registerUser(email, password);
      console.log('Registration successful:', response);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirm}
              required
              onChange={(e) => setConfirm(e.target.value)}
              margin="normal"
            />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, borderRadius: 2 }}>
              Register
            </Button>
            <MuiLink
              component={Link}
              to="/login"
              underline="hover"
              sx={{ display: 'block', mt: 2, textAlign: 'center' }}
            >
              Already have an account? Login
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
