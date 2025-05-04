import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { isNameTypingAllowed, isNumberTypingAllowed } from "../../utils/validators";
import ErrorAlert from "../shared/ErrorAlert";
import { ExpenseFormData, ExpenseFormOutput } from "../../hooks/useExpenseForm";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormOutput) => void;
  propertyId: number;
  initialData?: ExpenseFormData;
  actionError?: string | null;
  setActionError?: (msg: string | null) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  onClose,
  onSubmit,
  propertyId,
  initialData,
  actionError,
  setActionError,
}) => {
  const [form, setForm] = useState<ExpenseFormData>({
    date: "",
    category: "",
    description: "",
    amount: "",
    receipt_available: false,
    vendor: "",
    receipt_file: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        date: "",
        category: "",
        description: "",
        amount: "",
        receipt_available: false,
        vendor: "",
        receipt_file: null,
      });
    }
    setActionError?.(null); // ✅ Clear error on open
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionError?.(null); // ✅ Clear on typing
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNameTypingAllowed(e.target.value)) handleChange(e);
  };

  const handleNumberFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumberTypingAllowed(e.target.value)) handleChange(e);
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(form.amount || "0");
    onSubmit({ ...form, amount: numericAmount });
  };

  // ✅ Debug log to confirm error received
  console.log("🔍 actionError in AddExpenseModal:", actionError);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Expense" : `Add Expense for Property #${propertyId}`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {actionError && (
            <ErrorAlert
              message={actionError}
              title="Add/Edit Failed"
              onRetry={handleSubmit}
            />
          )}
          <TextField
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Category"
            name="category"
            select
            value={form.category}
            onChange={handleChange}
            fullWidth
          >
            {["Cleaning", "Maintenance", "Supplies", "Utilities", "Upgrades", "Insurance", "Marketing", "Other"].map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
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
            type="text"
            value={form.amount}
            onChange={handleNumberFieldChange}
            fullWidth
          />
          <TextField
            label="Vendor"
            name="vendor"
            value={form.vendor}
            onChange={handleNameFieldChange}
            fullWidth
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            {initialData ? "Replace Receipt" : "Upload Receipt"}
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setForm((prev) => ({
                  ...prev,
                  receipt_file: file,
                  receipt_available: !!file,
                }));
              }}
            />
          </Button>
          {form.receipt_file && (
            <span style={{ fontSize: "0.8rem", color: "#555" }}>
              Uploaded: {form.receipt_file.name}
            </span>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;