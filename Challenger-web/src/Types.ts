export interface PersonTotal {
  name: string;
  age: number;
  incomeTotal: number;
  expensesTotal: number;
  balance: number;
}

export interface DashboardData {
  people: PersonTotal[];
  grandTotalIncomes: number;
  grandTotalExpenses: number;
  netBalance: number;
}

export interface TransactionInput {
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  personId: string;
}

export interface PersonInput {
  name: string;
  age: number | '';
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  personName: string;
}