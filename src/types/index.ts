export type UserRole = 'admin' | 'kasir' | 'tenant';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  tenantId?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  standNumber: string;
  ownerName: string;
  phone: string;
  categoryDesc: string;
  status: 'active' | 'closed';
  commissionRate: number; // e.g. 0.10 (10%)
  balance: number;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  isAvailable: boolean;
  sku: string;
  calories?: string;
  isBestSeller?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export type PaymentMethod = 'qris' | 'cash' | 'transfer' | 'ewallet';
export type OrderType = 'dine_in' | 'take_away';

export interface TransactionTenantSplit {
  tenantId: string;
  tenantName: string;
  standNumber: string;
  subtotal: number;
  commission: number; // Setoran ke pengelola
  netAmount: number; // Hak bersih tenant
}

export interface TransactionItem {
  id: string;
  menuId: string;
  menuName: string;
  tenantId: string;
  tenantName: string;
  price: number;
  quantity: number;
  subtotal: number;
  note?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string; // e.g. TRX-20261005-001
  cashierId: string;
  cashierName: string;
  customerName: string;
  tableNumber: string;
  orderType: OrderType;
  items: TransactionItem[];
  subtotal: number;
  discountType: 'none' | 'mahasiswa_10' | 'dosen_15' | 'custom';
  discountAmount: number;
  taxAmount: number; // 0%
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  paymentStatus: 'paid' | 'pending';
  kitchenStatus: 'diterima' | 'dimasak' | 'siap' | 'selesai';
  createdAt: string; // ISO date string
  tenantSplits: TransactionTenantSplit[];
}

export interface FoodcourtSettings {
  foodcourtName: string;
  campusName: string;
  address: string;
  phone: string;
  receiptFooter: string;
  receiptPrefix: string; // e.g. 'TRX'
  receiptSeparator: string; // e.g. '-'
  receiptDigits: number; // e.g. 3 => 001
  logoUrl: string;
}
