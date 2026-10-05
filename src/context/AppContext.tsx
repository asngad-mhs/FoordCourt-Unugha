import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_MENUS,
  INITIAL_SETTINGS,
  INITIAL_TENANTS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from '../data/initialData';
import { sounds } from '../services/soundEffects';
import {
  CartItem,
  Category,
  FoodcourtSettings,
  MenuItem,
  OrderType,
  Tenant,
  Transaction,
  User,
} from '../types';
import { generateInvoiceNumber } from '../utils/formatters';

export type AppTab =
  | 'beranda'
  | 'pos'
  | 'laporan'
  | 'admin_menu'
  | 'admin_tenant'
  | 'admin_users'
  | 'admin_settings'
  | 'tenant_kitchen'
  | 'laravel_code';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: boolean;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;

  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Settings
  settings: FoodcourtSettings;
  updateSettings: (newSettings: Partial<FoodcourtSettings>) => void;

  // Users Management (Admin)
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Tenants Management
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  addTenant: (tenant: Omit<Tenant, 'id' | 'balance'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  toggleTenantStatus: (tenantId: string) => void;

  // Categories & Menus
  categories: Category[];
  addCategory: (name: string, description: string) => void;
  menus: MenuItem[];
  setMenus: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateMenuStock: (menuId: string, newStock: number) => void;
  toggleMenuAvailability: (menuId: string) => void;

  // Cart & POS
  cart: CartItem[];
  customerName: string;
  setCustomerName: (name: string) => void;
  tableNumber: string;
  setTableNumber: (tbl: string) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  discountType: 'none' | 'mahasiswa_10' | 'dosen_15' | 'custom';
  setDiscountType: (type: 'none' | 'mahasiswa_10' | 'dosen_15' | 'custom') => void;
  customDiscount: number;
  setCustomDiscount: (amt: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;

  addToCart: (item: MenuItem) => void;
  removeFromCart: (menuId: string) => void;
  updateCartQuantity: (menuId: string, qty: number) => void;
  updateCartItemNote: (menuId: string, note: string) => void;
  clearCart: () => void;
  cancelTransaction: () => void;

  // Transactions & Reports
  transactions: Transaction[];
  createTransaction: (
    paymentMethod: 'qris' | 'cash' | 'transfer' | 'ewallet',
    amountPaid: number
  ) => Transaction | null;
  updateKitchenStatus: (
    trxId: string,
    status: 'diterima' | 'dimasak' | 'siap' | 'selesai'
  ) => void;

  // Global reset
  resetAllData: () => void;

  // Cart calculations
  subtotal: number;
  discountAmount: number;
  total: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<FoodcourtSettings>(() => {
    const saved = localStorage.getItem('unugha_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('unugha_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current logged in user (defaults to Kasir 1 or saved)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unugha_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default kasir1
  });

  const [activeTab, setActiveTab] = useState<AppTab>('beranda');

  // Tenants
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('unugha_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('unugha_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Menus
  const [menus, setMenus] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('unugha_menus');
    return saved ? JSON.parse(saved) : INITIAL_MENUS;
  });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('unugha_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('unugha_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Order Details
  const [customerName, setCustomerName] = useState<string>('Mahasiswa');
  const [tableNumber, setTableNumber] = useState<string>('Meja 01');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [discountType, setDiscountType] = useState<'none' | 'mahasiswa_10' | 'dosen_15' | 'custom'>('none');
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('unugha_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('unugha_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('unugha_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('unugha_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('unugha_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('unugha_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('unugha_menus', JSON.stringify(menus));
  }, [menus]);

  useEffect(() => {
    localStorage.setItem('unugha_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('unugha_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth functions (FR-01, FR-02)
  const login = (username: string, password: string): { success: boolean; message?: string } => {
    const found = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!found) {
      return { success: false, message: 'Username tidak ditemukan di sistem UNUGHA.' };
    }

    if (!found.isActive) {
      return { success: false, message: 'Akun ini dinonaktifkan oleh administrator.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Password salah. Periksa kembali password Anda.' };
    }

    setCurrentUser(found);
    if (soundEnabled) sounds.playClick();
    return { success: true };
  };

  const logout = () => {
    if (soundEnabled) sounds.playClick();
    setCurrentUser(null);
  };

  // Settings update
  const updateSettings = (newSettings: Partial<FoodcourtSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (soundEnabled) sounds.playClick();
  };

  // Users CRUD (Admin) (FR-03)
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    if (soundEnabled) sounds.playClick();
  };

  const updateUser = (id: string, user: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...user } : u)));
    // If updating current user, sync
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...user } : null));
    }
    if (soundEnabled) sounds.playClick();
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
    if (soundEnabled) sounds.playClick();
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // Tenants CRUD (FR-1, FR-2)
  const addTenant = (tenant: Omit<Tenant, 'id' | 'balance'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: `tnt_${Date.now()}`,
      balance: 0,
    };
    setTenants((prev) => [...prev, newTenant]);
    if (soundEnabled) sounds.playClick();
  };

  const updateTenant = (id: string, tenant: Partial<Tenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...tenant } : t)));
    if (soundEnabled) sounds.playClick();
  };

  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
    // Also remove menus linked to tenant
    setMenus((prev) => prev.filter((m) => m.tenantId !== id));
    if (soundEnabled) sounds.playClick();
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? { ...t, status: t.status === 'active' ? 'closed' : 'active' }
          : t
      )
    );
  };

  // Categories & Menus CRUD (FR-1, FR-2, FR-3)
  const addCategory = (name: string, description: string) => {
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name,
      icon: 'UtensilsCrossed',
      description,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu_${Date.now()}`,
    };
    setMenus((prev) => [newItem, ...prev]);
    if (soundEnabled) sounds.playClick();
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, ...item } : m)));
    if (soundEnabled) sounds.playClick();
  };

  const deleteMenuItem = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
    setCart((prev) => prev.filter((c) => c.menuItem.id !== id));
    if (soundEnabled) sounds.playClick();
  };

  const updateMenuStock = (menuId: string, newStock: number) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? {
              ...m,
              stock: Math.max(0, newStock),
              isAvailable: newStock > 0,
            }
          : m
      )
    );
  };

  const toggleMenuAvailability = (menuId: string) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menuId ? { ...m, isAvailable: !m.isAvailable } : m
      )
    );
  };

  // Cart calculations
  const subtotal = cart.reduce((acc, it) => acc + it.menuItem.price * it.quantity, 0);

  let discountAmount = 0;
  if (discountType === 'mahasiswa_10') {
    discountAmount = Math.round(subtotal * 0.1);
  } else if (discountType === 'dosen_15') {
    discountAmount = Math.round(subtotal * 0.15);
  } else if (discountType === 'custom') {
    discountAmount = customDiscount;
  }
  const total = Math.max(0, subtotal - discountAmount);

  // Cart operations (FR-1, FR-2, FR-3, FR-7)
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable || item.stock <= 0) return;

    if (soundEnabled) sounds.playItemBeep();

    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) return prev; // max stock reached
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1, note: '' }];
    });
  };

  const removeFromCart = (menuId: string) => {
    if (soundEnabled) sounds.playClick();
    setCart((prev) => prev.filter((i) => i.menuItem.id !== menuId));
  };

  const updateCartQuantity = (menuId: string, qty: number) => {
    if (soundEnabled) sounds.playClick();
    if (qty <= 0) {
      removeFromCart(menuId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => {
        if (i.menuItem.id === menuId) {
          const clampedQty = Math.min(qty, i.menuItem.stock);
          return { ...i, quantity: clampedQty };
        }
        return i;
      })
    );
  };

  const updateCartItemNote = (menuId: string, note: string) => {
    setCart((prev) =>
      prev.map((i) => (i.menuItem.id === menuId ? { ...i, note } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cancelTransaction = () => {
    if (soundEnabled) sounds.playClick();
    setCart([]);
    setCustomerName('Mahasiswa');
    setTableNumber('Meja 01');
    setOrderType('dine_in');
    setDiscountType('none');
    setCustomDiscount(0);
  };

  // Create Transaction (FR-4, FR-5, Settings FR-2)
  const createTransaction = (
    paymentMethod: 'qris' | 'cash' | 'transfer' | 'ewallet',
    amountPaid: number
  ): Transaction | null => {
    if (cart.length === 0) return null;

    // Check stock
    for (const it of cart) {
      const currentMenu = menus.find((m) => m.id === it.menuItem.id);
      if (!currentMenu || currentMenu.stock < it.quantity) {
        return null;
      }
    }

    const nextSeq = transactions.length + 1;
    // Uses settings format! (FR-2 Settings, FR-5 Transaksi)
    const invoiceNumber = generateInvoiceNumber(
      nextSeq,
      settings.receiptPrefix || 'TRX',
      settings.receiptSeparator || '-',
      settings.receiptDigits || 3
    );

    // Tenant split calculation (FR-4 Laporan)
    const splitsMap = new Map<string, { tenantId: string; subtotal: number }>();
    cart.forEach((c) => {
      const prev = splitsMap.get(c.menuItem.tenantId) || {
        tenantId: c.menuItem.tenantId,
        subtotal: 0,
      };
      prev.subtotal += c.menuItem.price * c.quantity;
      splitsMap.set(c.menuItem.tenantId, prev);
    });

    const tenantSplits = Array.from(splitsMap.values()).map((s) => {
      const tenant = tenants.find((t) => t.id === s.tenantId);
      const commissionRate = tenant ? tenant.commissionRate : 0.1;
      const commission = Math.round(s.subtotal * commissionRate);
      return {
        tenantId: s.tenantId,
        tenantName: tenant?.name || 'Tenant Foodcourt',
        standNumber: tenant?.standNumber || 'Stand',
        subtotal: s.subtotal,
        commission, // setoran ke pengelola
        netAmount: s.subtotal - commission, // hak bersih mitra
      };
    });

    const now = new Date();
    const newTransaction: Transaction = {
      id: `trx-${Date.now()}`,
      invoiceNumber,
      cashierId: currentUser?.id || 'usr_kasir_1',
      cashierName: currentUser?.name || 'Kasir UNUGHA',
      customerName: customerName.trim() || 'Pelanggan',
      tableNumber: orderType === 'take_away' ? 'Take Away' : tableNumber,
      orderType,
      items: cart.map((c) => ({
        id: `ti-${Date.now()}-${c.menuItem.id}`,
        menuId: c.menuItem.id,
        menuName: c.menuItem.name,
        tenantId: c.menuItem.tenantId,
        tenantName: tenants.find((t) => t.id === c.menuItem.tenantId)?.name || '',
        price: c.menuItem.price,
        quantity: c.quantity,
        subtotal: c.menuItem.price * c.quantity,
        note: c.note,
      })),
      subtotal,
      discountType,
      discountAmount,
      taxAmount: 0,
      total,
      paymentMethod,
      amountPaid,
      change: Math.max(0, amountPaid - total),
      paymentStatus: 'paid',
      kitchenStatus: 'diterima',
      createdAt: now.toISOString(),
      tenantSplits,
    };

    // Deduct stock from menus
    setMenus((prev) =>
      prev.map((m) => {
        const cartMatch = cart.find((c) => c.menuItem.id === m.id);
        if (cartMatch) {
          const newStock = Math.max(0, m.stock - cartMatch.quantity);
          return {
            ...m,
            stock: newStock,
            isAvailable: newStock > 0,
          };
        }
        return m;
      })
    );

    // Update tenant balances
    setTenants((prev) =>
      prev.map((t) => {
        const split = tenantSplits.find((s) => s.tenantId === t.id);
        if (split) {
          return {
            ...t,
            balance: t.balance + split.netAmount,
          };
        }
        return t;
      })
    );

    // Save transaction
    setTransactions((prev) => [newTransaction, ...prev]);

    // Clear cart & play sound
    clearCart();
    if (soundEnabled) sounds.playCashRegisterChime();

    return newTransaction;
  };

  const updateKitchenStatus = (
    trxId: string,
    status: 'diterima' | 'dimasak' | 'siap' | 'selesai'
  ) => {
    if (soundEnabled) sounds.playClick();
    setTransactions((prev) =>
      prev.map((t) => (t.id === trxId ? { ...t, kitchenStatus: status } : t))
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setTenants(INITIAL_TENANTS);
    setCategories(INITIAL_CATEGORIES);
    setMenus(INITIAL_MENUS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCart([]);
    setCurrentUser(INITIAL_USERS[1]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn: currentUser !== null,
        login,
        logout,
        activeTab,
        setActiveTab,
        settings,
        updateSettings,
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        tenants,
        setTenants,
        addTenant,
        updateTenant,
        deleteTenant,
        toggleTenantStatus,
        categories,
        addCategory,
        menus,
        setMenus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateMenuStock,
        toggleMenuAvailability,
        transactions,
        cart,
        customerName,
        setCustomerName,
        tableNumber,
        setTableNumber,
        orderType,
        setOrderType,
        discountType,
        setDiscountType,
        customDiscount,
        setCustomDiscount,
        soundEnabled,
        setSoundEnabled,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemNote,
        clearCart,
        cancelTransaction,
        createTransaction,
        updateKitchenStatus,
        resetAllData,
        subtotal,
        discountAmount,
        total,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
