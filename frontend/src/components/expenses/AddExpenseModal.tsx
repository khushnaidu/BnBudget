import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from '@mui/material';
import { Expense } from '../../types/expenseTypes';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Expense) => void;
  initialData?: Expense;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ open, onClose, onSubmit, initialData }) => {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    propertyId: '',
    expenseDate: '',
    category: '',
    description: '',
    amount: '',
    receiptAvailable: 'No',
    vendor: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        propertyId: String(initialData.propertyId),
        expenseDate: initialData.expenseDate,
        category: initialData.category,
        description: initialData.description || '',
        amount: String(initialData.amount),
        receiptAvailable: initialData.receiptAvailable,
        vendor: initialData.vendor || '',
      });
    } else {
      setFormData({
        propertyId: '',
        expenseDate: '',
        category: '',
        description: '',
        amount: '',
        receiptAvailable: 'No',
        vendor: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const finalData: Expense = {
      ...(initialData || { id: Date.now() }),
      propertyId: Number(formData.propertyId),
      expenseDate: formData.expenseDate,
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      receiptAvailable: formData.receiptAvailable as 'Yes' | 'No',
      vendor: formData.vendor,
    };
    onSubmit(finalData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <TextField
            required
            label="Property ID"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            label="Date"
            name="expenseDate"
            type="date"
            value={formData.expenseDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            required
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            label="Receipt Available"
            name="receiptAvailable"
            value={formData.receiptAvailable}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
          <TextField
            label="Vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;
