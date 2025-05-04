import { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  Expense,
} from "../api/expenses";
import { handleApiError } from "../utils/errorHandler";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err, "Failed to load expenses", "fetchExpenses"));
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expense: Expense) => {
    const tempId = Date.now();
    const newExpense = { ...expense, expense_id: tempId };
  
    setExpenses((prev) => [...prev, newExpense]);
  
    try {
      await addExpense(newExpense); // don't add it again
      setActionError(null);
    } catch (err) {
      // rollback
      setExpenses((prev) => prev.filter((e) => e.expense_id !== tempId));
      throw new Error(handleApiError(err, "Failed to add expense", "createExpense"));
    }
  };
  

  const editExpense = async (id: number, data: Partial<Expense>) => {
    try {
      await updateExpense(id, data);
      setExpenses((prev) =>
        prev.map((e) => (e.expense_id === id ? { ...e, ...data } : e))
      );
      setActionError(null);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to edit expense", "editExpense"));
    }
  };

  const removeExpense = async (id: number) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.expense_id !== id));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    actionError,
    setActionError,
    fetchExpenses,
    createExpense,
    editExpense,
    removeExpense,
  };
};