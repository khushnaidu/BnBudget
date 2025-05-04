import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Snackbar,
  Button,
} from "@mui/material";
import { useExpenses } from "../hooks/useExpenses";
import PropertyExpenseCard, { Expense } from "../components/expenses/PropertyExpenseCard";
import AddExpenseModal from "../components/expenses/AddExpenseModal";
import { ExpenseFormData, ExpenseFormOutput } from "../hooks/useExpenseForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useUndoableDelete } from "../hooks/useUndoableDelete";
import ErrorAlert from "../components/shared/ErrorAlert";
import { handleApiError } from "../utils/errorHandler";

const ExpenseDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState<"All" | number>("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
  const [editedExpense, setEditedExpense] = useState<ExpenseFormData | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const {
    expenses,
    loading,
    error,
    actionError,
    setActionError,
    createExpense,
    editExpense,
    removeExpense,
    fetchExpenses,
  } = useExpenses();

  const {
    deleteWithUndo,
    undoDelete,
    snackbarOpen,
    closeSnackbar,
    deletedItems,
  } = useUndoableDelete<Expense>(
    async (id) => await removeExpense(id),
    () => fetchExpenses(),
    60000
  );

  const categories = Array.from(new Set(expenses.map((e) => e.category)));
  const properties = Array.from(new Set(expenses.map((e) => e.property_id)));

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => !deletedItems.includes(e.expense_id))
      .filter((e) => {
        const categoryMatch = selectedCategory === "All" || e.category === selectedCategory;
        const propertyMatch = selectedProperty === "All" || e.property_id === selectedProperty;
        return categoryMatch && propertyMatch;
      });
  }, [selectedCategory, selectedProperty, expenses, deletedItems]);

  const groupedByProperty = useMemo(() => {
    const map: Record<number, Expense[]> = {};
    filteredExpenses.forEach((e) => {
      if (!map[e.property_id]) map[e.property_id] = [];
      map[e.property_id].push(e);
    });
    return map;
  }, [filteredExpenses]);

  const handleAddExpense = (propertyId: number) => {
    setActivePropertyId(propertyId);
    setEditedExpense(null);
    setAddModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setActivePropertyId(expense.property_id);
    setEditedExpense({
      ...expense,
      amount: expense.amount.toString(),
    });
    setAddModalOpen(true);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setPendingDelete(expense);
    setConfirmOpen(true);
  };

  const confirmAndDelete = () => {
    if (pendingDelete) {
      setConfirmOpen(false);
      deleteWithUndo(pendingDelete, pendingDelete.expense_id);
    }
    setPendingDelete(null);
  };

  const handleViewReceipt = (expenseId: number) => {
    console.log("View receipt for expense:", expenseId);
  };

  const handleAddExpenseSubmit = async (data: ExpenseFormOutput) => {
    if (activePropertyId == null) return;

    const parsed = {
      ...data,
      property_id: activePropertyId,
    };

    try {
      if (editedExpense) {
        const expenseId = (editedExpense as any).expense_id;
        await editExpense(expenseId, parsed);
      } else {
        await createExpense(parsed as Expense);
      }

      setAddModalOpen(false);
      setEditedExpense(null);
    } catch (err) {
      setActionError(handleApiError(err, "Failed to save expense", "handleAddExpenseSubmit"));
    }
  };

  //  Handles cleanup when snackbar auto-closes
  const enhancedCloseSnackbar = () => {
    if (pendingDelete) {
      const id = (pendingDelete as any).expense_id ?? (pendingDelete as any).id;

      // If user didn't undo, delete now
      removeExpense(id)
        .then(() => {
          fetchExpenses(); // Refresh state (optional if optimistic)
        })
        .finally(() => {
          setPendingDelete(null);
        });
    }

    closeSnackbar(); // close snackbar visibility
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Expense Dashboard
      </Typography>

      {loading ? (
        <Typography>Loading expenses...</Typography>
      ) : (
        <>
          <ErrorAlert message={error} title="Failed to load expenses" />

          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedProperty}
              onChange={(e) =>
                setSelectedProperty(e.target.value === "All" ? "All" : Number(e.target.value))
              }
              displayEmpty
              size="small"
            >
              <MenuItem value="All">All Properties</MenuItem>
              {properties.map((pid) => (
                <MenuItem key={pid} value={pid}>
                  {pid}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {Object.entries(groupedByProperty).map(([propertyIdStr, expenses]) => {
              const propertyId = Number(propertyIdStr);
              return (
                <PropertyExpenseCard
                  key={propertyId}
                  propertyId={propertyId}
                  expenses={expenses}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              );
            })}
          </Box>

          <AddExpenseModal
            open={addModalOpen}
            onClose={() => {
              setAddModalOpen(false);
              setEditedExpense(null);
            }}
            onSubmit={handleAddExpenseSubmit}
            propertyId={activePropertyId ?? 0}
            initialData={editedExpense ?? undefined}
            actionError={actionError}
            setActionError={setActionError}
          />

          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={confirmAndDelete}
          />

<Snackbar
  open={snackbarOpen}
  message="Expense deleted"
  action={
    <Button color="secondary" size="small" onClick={undoDelete}>
      UNDO
    </Button>
  }
  autoHideDuration={60000}
  onClose={(event, reason) => {
    if (reason !== "clickaway") {
      closeSnackbar(); // always finalize
    }
  }}
/>

        </>
      )}
    </Container>
  );
};

export default ExpenseDashboard;