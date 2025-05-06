import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useExpenses } from '../hooks/useExpenses';
import { Expense } from '../types/expenseTypes';
import { groupBy } from 'lodash';
import PropertyExpenseStack from '../components/expenses/PropertyExpenseStack';
import { useProperties } from '../hooks/useProperties';
import ExpenseModal from '../components/expenses/ExpenseModal';

const ExpenseDashboard: React.FC = () => {
  const {
    expenses,
    loading,
    error,
    removeExpense,
  } = useExpenses();

  const { properties } = useProperties();

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    removeExpense(id);
    if (selectedExpense?.id === id) {
      setSelectedExpense(null);
      setModalOpen(false);
    }
  };

  const grouped = groupBy(expenses, 'propertyId');

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Expense Dashboard</Typography>
        <Button variant="contained" disabled>
          + Add Expense
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading expenses...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : expenses.length === 0 ? (
        <Typography>No expenses found. Add one above!</Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(grouped).map(([propertyId, group]) => {
            const property = properties.find((p) => p.property_id === Number(propertyId));
            return (
              <PropertyExpenseStack
                key={propertyId}
                propertyName={property?.name || `Property ${propertyId}`}
                expenses={group as Expense[]}
                onDelete={handleDelete}
                onView={(expense) => {
                  setSelectedExpense(expense);
                  setModalOpen(true);
                }}
              />
            );
          })}
        </Box>
      )}

      <ExpenseModal
        open={modalOpen}
        expense={selectedExpense}
        onClose={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default ExpenseDashboard;
