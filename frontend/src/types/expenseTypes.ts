export interface Expense {
    id: number;
    propertyId: number;
    expenseDate: string;     
    category: string;
    description?: string;
    amount: number;
    receiptAvailable: 'Yes' | 'No';
    vendor?: string;
  }
  