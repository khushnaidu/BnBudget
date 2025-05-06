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
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExpenseDashboard: React.FC = () => {
  const {
    expenses,
    loading,
    error,
    createExpense,
    removeExpense,
  } = useExpenses();

  const { properties } = useProperties();
  const [adding, setAdding] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    removeExpense(id);
    if (selectedExpense?.id === id) {
      setSelectedExpense(null);
      setModalOpen(false);
    }
  };

  const handleSubmit = (expense: Expense) => {
    createExpense(expense);
    setAdding(false);
  };

  const grouped = groupBy(expenses, 'propertyId');

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Expense Report by Property', 14, 20);
    let yOffset = 30;
  
    Object.entries(grouped).forEach(([propertyId, group], index) => {
      const property = properties.find((p) => p.property_id === Number(propertyId));
      const title = `Expenses for ${property?.name || `Property ${propertyId}`}`;
      
      if (index !== 0) {
        doc.addPage();
        yOffset = 20;
      }
  
      doc.setFontSize(14);
      doc.text(title, 14, yOffset);
  
      const rows = (group as Expense[]).map((e) => [
        e.expenseDate,
        e.category,
        e.description || '-',
        e.vendor || '-',
        `$${e.amount.toFixed(2)}`
      ]);
  
      autoTable(doc, {
        head: [['Date', 'Category', 'Description', 'Vendor', 'Amount']],
        body: rows,
        startY: yOffset + 10,
      });
    });
  
    doc.save('full-expense-summary.pdf');
  };
  

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Expense Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleGeneratePDF}>
            Generate PDF Summary
          </Button>
          <Button variant="contained" onClick={() => setAdding(true)}>
            + Add Expense
          </Button>
        </Box>
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

      <AddExpenseModal
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={handleSubmit}
        propertyOptions={properties}
      />

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
