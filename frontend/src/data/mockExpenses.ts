import axios from "axios";

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

let mockExpenses: Expense[] = [
  {
    expense_id: 7001,
    property_id: 1001,
    date: "2023-05-16",
    category: "Cleaning",
    description: "Post-stay cleaning",
    amount: 75,
    receipt_available: true,
    vendor: "CleanPro",
  },
  {
    expense_id: 7002,
    property_id: 1001,
    date: "2023-05-17",
    category: "Maintenance",
    description: "Plumbing repair",
    amount: 120,
    receipt_available: true,
    vendor: "PlumbRight",
  },
  {
    expense_id: 7003,
    property_id: 1002,
    date: "2023-06-05",
    category: "Supplies",
    description: "Toiletries restock",
    amount: 45,
    receipt_available: false,
    vendor: "Amazon",
  },
  {
    expense_id: 7004,
    property_id: 1003,
    date: "2023-06-25",
    category: "Utilities",
    description: "Monthly internet bill",
    amount: 65,
    receipt_available: true,
    vendor: "Xfinity",
  },
  {
    expense_id: 7005,
    property_id: 1004,
    date: "2023-05-21",
    category: "Cleaning",
    description: "Deep cleaning service",
    amount: 110,
    receipt_available: true,
    vendor: "EliteClean",
  },
  {
    expense_id: 7006,
    property_id: 1001,
    date: "2023-05-18",
    category: "Supplies",
    description: "Linens replacement",
    amount: 85,
    receipt_available: true,
    vendor: "Bed Bath & Beyond",
  },
  {
    expense_id: 7007,
    property_id: 1002,
    date: "2023-06-10",
    category: "Maintenance",
    description: "AC unit servicing",
    amount: 220,
    receipt_available: true,
    vendor: "CoolAir",
  },
  {
    expense_id: 7008,
    property_id: 1005,
    date: "2023-08-20",
    category: "Upgrades",
    description: "New patio furniture",
    amount: 650,
    receipt_available: true,
    vendor: "Home Depot",
  },
  {
    expense_id: 7009,
    property_id: 1003,
    date: "2023-07-01",
    category: "Insurance",
    description: "Monthly property insurance",
    amount: 125,
    receipt_available: true,
    vendor: "State Farm",
  },
  {
    expense_id: 7010,
    property_id: 1004,
    date: "2023-05-25",
    category: "Marketing",
    description: "Professional photos",
    amount: 300,
    receipt_available: true,
    vendor: "PhotoStudio",
  },
];

// API Functions

export const getExpenses = async (): Promise<Expense[]> => {
  return Promise.resolve(mockExpenses);
  // return axios.get("/api/expenses").then((res) => res.data);
};

export const addExpense = async (data: Expense): Promise<void> => {
  mockExpenses.push({ ...data, expense_id: Date.now() });
  return Promise.resolve();
  // return axios.post("/api/expenses", data);
};

export const updateExpense = async (id: number, data: Partial<Expense>): Promise<void> => {
  mockExpenses = mockExpenses.map((e) => (e.expense_id === id ? { ...e, ...data } : e));
  return Promise.resolve();
  // return axios.put(`/api/expenses/${id}`, data);
};

export const deleteExpense = async (id: number): Promise<void> => {
  mockExpenses = mockExpenses.filter((e) => e.expense_id !== id);
  return Promise.resolve();
  // return axios.delete(`/api/expenses/${id}`);
};