import React from 'react';
import { Typography, Box } from '@mui/material';

interface User {
  name: string;
  email: string;
  age?: number;
}

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Information
      </Typography>
      <Typography variant="body1">
        <strong>Name:</strong> {user.name}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user.email}
      </Typography>
      {user.age && (
        <Typography variant="body1">
          <strong>Age:</strong> {user.age}
        </Typography>
      )}
    </Box>
  );
};

export default UserInfo;