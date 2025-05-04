import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Expense {
  expense_id: number;
  property_id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  receipt_available: boolean;
  vendor: string;
}

interface PropertyExpenseCardProps {
  propertyId: number;
  expenses: Expense[];
  onAddExpense?: (propertyId: number) => void;
  onViewReceipt?: (expense: Expense) => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (expense: Expense) => void;
}

const PropertyExpenseCard: React.FC<PropertyExpenseCardProps> = ({
  propertyId,
  expenses,
  onAddExpense,
  onViewReceipt,
  onEditExpense,
  onDeleteExpense,
}) => {
  return (
    <Card sx={{ width: 340 }}>
      <CardHeader
        title={`Property #${propertyId}`}
        action={
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => onAddExpense?.(propertyId)}
          >
            Add
          </Button>
        }
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {expenses.map((exp, idx) => (
            <Box key={exp.expense_id}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" fontWeight="bold">
                  ${exp.amount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {exp.date}
                </Typography>
              </Box>
              <Typography variant="body2">{exp.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                {exp.category} • Vendor: {exp.vendor}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Receipt: {exp.receipt_available ? "✅" : "❌"}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {exp.receipt_available && (
                    <IconButton size="small" onClick={() => onViewReceipt?.(exp)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={() => onEditExpense?.(exp)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDeleteExpense?.(exp)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              {idx < expenses.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyExpenseCard;