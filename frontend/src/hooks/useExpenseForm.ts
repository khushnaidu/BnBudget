import { useState, useEffect } from "react";
import {
  isRequired,
  isNumberTypingAllowed,
  isNameTypingAllowed,
} from "../utils/validators";

export interface ExpenseFormData {
  date: string;
  category: string;
  description: string;
  amount: string;
  receipt_available: boolean;
  vendor: string;
  receipt_file?: File | null;
}

export const useExpenseForm = (initialData?: ExpenseFormData) => {
  const [form, setForm] = useState<ExpenseFormData>({
    date: "",
    category: "",
    description: "",
    amount: "",
    receipt_available: false,
    vendor: "",
    receipt_file: null,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, amount: initialData.amount.toString() });
    }
  }, [initialData]);

  useEffect(() => {
    setIsValid(
      isRequired(form.date) &&
      isRequired(form.category) &&
      isRequired(form.amount) &&
      parseFloat(form.amount) > 0 &&
      isRequired(form.vendor)
    );
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isNameTypingAllowed(value)) handleChange(e);
  };

  const handleNumberFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || isNumberTypingAllowed(value)) handleChange(e);
  };

  return {
    form,
    setForm,
    touched,
    isValid,
    handleChange,
    handleNameFieldChange,
    handleNumberFieldChange,
    setTouched,
  };
};
export type ExpenseFormOutput = Omit<ExpenseFormData, "amount"> & { amount: number };