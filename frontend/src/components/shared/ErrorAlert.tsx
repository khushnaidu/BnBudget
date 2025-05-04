// src/components/common/ErrorAlert.tsx
import React from "react";
import { Alert, Button, Box } from "@mui/material";

interface ErrorAlertProps {
  message: string | null;
  title?: string;
  onRetry?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, title, onRetry }) => {
  if (!message) return null;

  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry} variant="outlined">
            Retry
          </Button>
        )
      }
      sx={{ mb: 2 }}
    >
      <strong>{title || "Error"}:</strong> {message}
    </Alert>
  );
};

export default ErrorAlert;