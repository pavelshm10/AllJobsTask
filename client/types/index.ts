export interface CustomerOrderSummary {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Product {
  id: number;
  productName: string;
  category: string;
  supplier: string;
  unitPrice: number;
  units: number;
}
