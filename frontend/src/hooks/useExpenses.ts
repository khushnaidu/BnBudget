import { useState, useEffect } from 'react';
import axios from 'axios';
import { Expense } from '../types/expenseTypes';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.expenses, {
          params: { owner_id: user.id },
        });

        const flat = Object.values(res.data).flat() as Expense[];
        const normalized = flat.map((exp: any) => ({
          ...exp,
          expenseDate: exp.expense_date,
          propertyId: exp.property_id,
          receiptAvailable: exp.receipt_available,
        }));
        setExpenses(flat);
      } catch (err) {
        setError('Failed to fetch expenses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user?.id]);

  const createExpense = async (expense: Expense) => {
    try {
      const res = await axios.post(API_ENDPOINTS.expenses, {
        ...expense,
        owner_id: user?.id,
      });
      setExpenses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error creating expense:', err);
    }
  };

  const editExpense = async (id: number, updates: Partial<Expense>) => {
    try {
      const res = await axios.put(`${API_ENDPOINTS.expenses}/${id}`, updates);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, ...res.data } : exp))
      );
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  const removeExpense = async (id: number) => {
    try {
      await axios.delete(`${API_ENDPOINTS.expenses}/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  return {
    expenses,
    createExpense,
    editExpense,
    removeExpense,
    loading,
    error,
  };
};
