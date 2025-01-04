export interface Transaction {
  id?: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
