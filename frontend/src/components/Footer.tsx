import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "linear-gradient(90deg, #d83b4c 0%, #fd5c63 100%)",
        color: "white",
        textAlign: "center",
        py: 2,
        mt: 4,
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      <Typography variant="body2">
        © 2025 Airbnb Expense Management System
      </Typography>
    </Box>
  );
};

export default Footer;
