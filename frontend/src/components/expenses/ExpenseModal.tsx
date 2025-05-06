import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Divider,
  Box,
} from '@mui/material';
import { Expense } from '../../types/expenseTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  expense: Expense | null;
}

const ExpenseModal: React.FC<Props> = ({ open, onClose, onDelete, expense }) => {
  if (!expense) return null;
  console.log('Modal Expense:', expense);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Expense Details</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography><strong>Date:</strong> {expense.expenseDate}</Typography>
          <Typography><strong>Category:</strong> {expense.category}</Typography>
          {expense.description && (
            <Typography><strong>Description:</strong> {expense.description}</Typography>
          )}
          <Typography><strong>Amount:</strong> ${expense.amount.toFixed(2)}</Typography>
          <Typography><strong>Vendor:</strong> {expense.vendor || 'N/A'}</Typography>
          <Typography><strong>Receipt Available:</strong> {expense.receiptAvailable || 'No'}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDelete(expense.id);
            onClose();
          }}
        >
          Mark as Paid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseModal;
