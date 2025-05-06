import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { Expense } from '../../types/expenseTypes';
import { Property } from '../../types/propertyTypes';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (expense: Expense) => void;
  propertyOptions: Property[];
}

const defaultForm = {
  propertyId: 0,
  expenseDate: '',
  category: '',
  description: '',
  amount: 0,
  vendor: '',
  receiptAvailable: 'No' as 'Yes' | 'No',
};

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  onClose,
  onSubmit,
  propertyOptions,
}) => {
  const [form, setForm] = useState({ ...defaultForm });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form as Expense);
    setForm({ ...defaultForm });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            select
            label="Property"
            name="propertyId"
            value={form.propertyId}
            onChange={handleChange}
            fullWidth
            required
          >
            {propertyOptions.map((p) => (
              <MenuItem key={p.property_id} value={p.property_id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date"
            name="expenseDate"
            type="date"
            value={form.expenseDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Vendor"
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;
