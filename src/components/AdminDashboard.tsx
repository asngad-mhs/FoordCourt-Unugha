import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import {
  Store,
  Utensils,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  DollarSign,
  Phone,
  User,
  Percent,
  Search,
  Check,
  X,
  Layers,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { MenuItem, Tenant } from '../types';
import { BackToHomeButton } from './BackToHomeButton';

export const AdminDashboard: React.FC = () => {
  const {
    tenants,
    menus,
    categories,
    addCategory,
    updateMenuStock,
    toggleMenuAvailability,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addTenant,
    updateTenant,
    deleteTenant,
    toggleTenantStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'menus' | 'tenants'>('menus');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [filterTenant, setFilterTenant] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals for Menu
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  // Modals for Tenant
  const [isAddTenantOpen, setIsAddTenantOpen] = useState<boolean>(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Add Category modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatDesc, setNewCatDesc] = useState<string>('');

  // New Menu Form State (FR-1, FR-2, FR-3)
  const [newMenu, setNewMenu] = useState({
    tenantId: tenants[0]?.id || '',
    categoryId: 'cat_heavy',
    name: '',
    price: 15000,
    description: '',
    image: '',
    stock: 25,
    isAvailable: true,
    sku: `UG-${Math.floor(100 + Math.random() * 900)}`,
  });

  // New Tenant Form State (FR-1, FR-2)
  const [newTenant, setNewTenant] = useState({
    name: '',
    standNumber: `Stand 0${tenants.length + 1}`,
    ownerName: '',
    phone: '08',
    categoryDesc: 'Makanan & Minuman Khas',
    status: 'active' as const,
    commissionRate: 0.1, // 10%
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
  });

  const filteredMenus = menus.filter((m) => {
    const matchSearch =
      menuSearch === '' ||
      m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      m.sku.toLowerCase().includes(menuSearch.toLowerCase());
    const matchTenant = filterTenant === 'all' || m.tenantId === filterTenant;
    const matchCategory = filterCategory === 'all' || m.categoryId === filterCategory;
    return matchSearch && matchTenant && matchCategory;
  });

  // Handlers
  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.name.trim() || !newMenu.tenantId) return;

    const defaultImage =
      newMenu.image.trim() ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';

    addMenuItem({
      ...newMenu,
      image: defaultImage,
      isAvailable: newMenu.stock > 0,
    });

    setIsAddMenuOpen(false);
    setNewMenu({
      tenantId: tenants[0]?.id || '',
      categoryId: 'cat_heavy',
      name: '',
      price: 15000,
      description: '',
      image: '',
      stock: 25,
      isAvailable: true,
      sku: `UG-${Math.floor(100 + Math.random() * 900)}`,
    });
  };

  const handleUpdateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu) return;

    updateMenuItem(editingMenu.id, {
      ...editingMenu,
      isAvailable: editingMenu.stock > 0 && editingMenu.isAvailable,
    });
    setEditingMenu(null);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name.trim()) return;

    addTenant(newTenant);
    setIsAddTenantOpen(false);
    setNewTenant({
      name: '',
      standNumber: `Stand 0${tenants.length + 2}`,
      ownerName: '',
      phone: '08',
      categoryDesc: 'Makanan & Minuman Khas',
      status: 'active',
      commissionRate: 0.1,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
    });
  };

  const handleUpdateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    updateTenant(editingTenant.id, editingTenant);
    setEditingTenant(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatDesc.trim());
    setIsAddCategoryOpen(false);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <BackToHomeButton />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Manajemen Kios Tenant & Master Menu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola data kios mitra (FR-1, FR-2) dan master menu makanan, minuman, harga, stok (FR-1, FR-2, FR-3)
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('menus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'menus'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Manajemen Menu ({menus.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'tenants'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Manajemen Tenant Kios ({tenants.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: MANAJEMEN MENU ================= */}
      {activeTab === 'menus' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Cari menu berdasarkan nama atau SKU..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Filter Stand */}
            <select
              value={filterTenant}
              onChange={(e) => setFilterTenant(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">Semua Stand Kios</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Filter Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                title="Tambah Kategori Baru"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Kategori</span>
              </button>

              <button
                onClick={() => setIsAddMenuOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu Baru (FR-1)</span>
              </button>
            </div>
          </div>

          {/* Menus Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Menu & Foto (Opsional)</th>
                    <th className="px-4 py-3.5">Kios Tenant (FR-2)</th>
                    <th className="px-4 py-3.5">Kategori (FR-2)</th>
                    <th className="px-4 py-3.5">Harga</th>
                    <th className="px-4 py-3.5 text-center">Stok</th>
                    <th className="px-4 py-3.5 text-center">Status Menu (FR-3)</th>
                    <th className="px-5 py-3.5 text-center">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMenus.map((menu) => {
                    const tenant = tenants.find((t) => t.id === menu.tenantId);
                    const category = categories.find((c) => c.id === menu.categoryId);

                    return (
                      <tr key={menu.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                menu.image ||
                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'
                              }
                              alt={menu.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{menu.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                SKU: {menu.sku}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-medium text-slate-700">
                          {tenant?.name || 'Tidak Terhubung'}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            {category?.name || 'Umum'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-bold font-mono text-emerald-800">
                          {formatRupiah(menu.price)}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                            <button
                              onClick={() => updateMenuStock(menu.id, menu.stock - 1)}
                              className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                              title="Kurangi 1 Stok"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold font-mono text-slate-800">
                              {menu.stock}
                            </span>
                            <button
                              onClick={() => updateMenuStock(menu.id, menu.stock + 5)}
                              className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                              title="Tambah 5 Stok"
                            >
                              +5
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => toggleMenuAvailability(menu.id)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                              menu.isAvailable && menu.stock > 0
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            }`}
                            title="Klik untuk ubah status tersedia / habis (FR-3)"
                          >
                            {menu.isAvailable && menu.stock > 0 ? '● Tersedia' : '○ Habis'}
                          </button>
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingMenu({ ...menu })}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition"
                              title="Edit Menu (FR-1)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus menu "${menu.name}"?`)) {
                                  deleteMenuItem(menu.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus Menu (FR-1)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MANAJEMEN TENANT (FR-1, FR-2) ================= */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                FR-1: CRUD Data Kios Tenant & Status Aktif
              </h3>
              <p className="text-xs text-slate-500">
                Nama kios, penanggung jawab, kontak, setoran pengelola, dan status operasional
              </p>
            </div>
            <button
              onClick={() => setIsAddTenantOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Kios Tenant Baru (FR-1)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => {
              const menuCount = menus.filter((m) => m.tenantId === tenant.id).length;

              return (
                <div
                  key={tenant.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {tenant.standNumber}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleTenantStatus(tenant.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                            tenant.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Ubah Status Kios (FR-1)"
                        >
                          {tenant.status === 'active' ? '● Aktif' : '○ Nonaktif'}
                        </button>

                        <button
                          onClick={() => setEditingTenant({ ...tenant })}
                          className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                          title="Edit Tenant (FR-1)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus kios tenant "${tenant.name}"? Menu terkait juga akan terhapus.`)) {
                              deleteTenant(tenant.id);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Hapus Tenant (FR-1)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-slate-900">{tenant.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{tenant.categoryDesc}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Penanggung Jawab: <strong>{tenant.ownerName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Kontak/WA: {tenant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Percent className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Setoran Pengelola:{' '}
                          <strong className="text-emerald-700">
                            {Math.round(tenant.commissionRate * 100)}%
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Saldo Akumulasi:</span>
                      <span className="font-bold font-mono text-emerald-900 text-sm">
                        {formatRupiah(tenant.balance)}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {menuCount} Menu Terhubung
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL: TAMBAH MENU (FR-1) ================= */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-700" />
                Tambah Menu Baru (FR-1)
              </h3>
              <button
                onClick={() => setIsAddMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenu} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kios Tenant Pemilik Menu (FR-2)
                </label>
                <select
                  value={newMenu.tenantId}
                  onChange={(e) => setNewMenu({ ...newMenu, tenantId: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.standNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  placeholder="Contoh: Nasi Goreng Santri Spesial"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kategori (FR-2)</label>
                  <select
                    value={newMenu.categoryId}
                    onChange={(e) => setNewMenu({ ...newMenu, categoryId: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={newMenu.price}
                    onChange={(e) => setNewMenu({ ...newMenu, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newMenu.stock}
                    onChange={(e) => setNewMenu({ ...newMenu, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status (FR-3)</label>
                  <select
                    value={newMenu.isAvailable ? '1' : '0'}
                    onChange={(e) =>
                      setNewMenu({ ...newMenu, isAvailable: e.target.value === '1' })
                    }
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    <option value="1">Tersedia</option>
                    <option value="0">Habis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Foto Menu (Opsional)</label>
                <input
                  type="text"
                  value={newMenu.image}
                  onChange={(e) => setNewMenu({ ...newMenu, image: e.target.value })}
                  placeholder="https://... (URL foto makanan / minuman)"
                  className="w-full p-2.5 border rounded-xl text-slate-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deskripsi Menu</label>
                <textarea
                  value={newMenu.description}
                  onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border rounded-xl"
                  placeholder="Keterangan rasa, porsi, atau bahan..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT MENU (FR-1) ================= */}
      {editingMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Edit Data Menu (FR-1)
              </h3>
              <button
                onClick={() => setEditingMenu(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMenu} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kios Tenant (FR-2)
                </label>
                <select
                  value={editingMenu.tenantId}
                  onChange={(e) =>
                    setEditingMenu({ ...editingMenu, tenantId: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-xl"
                  required
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.standNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={editingMenu.name}
                  onChange={(e) =>
                    setEditingMenu({ ...editingMenu, name: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kategori (FR-2)</label>
                  <select
                    value={editingMenu.categoryId}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, categoryId: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={editingMenu.price}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stok</label>
                  <input
                    type="number"
                    value={editingMenu.stock}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, stock: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status (FR-3)</label>
                  <select
                    value={editingMenu.isAvailable ? '1' : '0'}
                    onChange={(e) =>
                      setEditingMenu({
                        ...editingMenu,
                        isAvailable: e.target.value === '1',
                      })
                    }
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    <option value="1">Tersedia</option>
                    <option value="0">Habis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Foto Menu (Opsional)</label>
                <input
                  type="text"
                  value={editingMenu.image || ''}
                  onChange={(e) =>
                    setEditingMenu({ ...editingMenu, image: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-xl text-slate-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deskripsi Menu</label>
                <textarea
                  value={editingMenu.description}
                  onChange={(e) =>
                    setEditingMenu({ ...editingMenu, description: e.target.value })
                  }
                  rows={2}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMenu(null)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Perbarui Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TAMBAH TENANT (FR-1) ================= */}
      {isAddTenantOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-700" />
                Daftarkan Kios Tenant Baru (FR-1)
              </h3>
              <button
                onClick={() => setIsAddTenantOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Kios / Stand</label>
                <input
                  type="text"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="Contoh: Dapur Santri Barokah"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nomor Stand</label>
                  <input
                    type="text"
                    value={newTenant.standNumber}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, standNumber: e.target.value })
                    }
                    placeholder="Stand 06"
                    className="w-full p-2.5 border rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Setoran Komisi (%)</label>
                  <input
                    type="number"
                    value={Math.round(newTenant.commissionRate * 100)}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        commissionRate: Number(e.target.value) / 100,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Penanggung Jawab (FR-1)</label>
                <input
                  type="text"
                  value={newTenant.ownerName}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, ownerName: e.target.value })
                  }
                  placeholder="Nama pemilik / koki kios"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">No. WhatsApp / Telepon</label>
                <input
                  type="text"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  placeholder="08..."
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Spesialisasi Menu</label>
                <input
                  type="text"
                  value={newTenant.categoryDesc}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, categoryDesc: e.target.value })
                  }
                  placeholder="Contoh: Aneka Olahan Bebek & Ayam Sambal Korek"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTenantOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Daftarkan Kios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT TENANT (FR-1) ================= */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Edit Kios Tenant (FR-1)
              </h3>
              <button
                onClick={() => setEditingTenant(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTenant} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Kios / Stand</label>
                <input
                  type="text"
                  value={editingTenant.name}
                  onChange={(e) =>
                    setEditingTenant({ ...editingTenant, name: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nomor Stand</label>
                  <input
                    type="text"
                    value={editingTenant.standNumber}
                    onChange={(e) =>
                      setEditingTenant({ ...editingTenant, standNumber: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Setoran Komisi (%)</label>
                  <input
                    type="number"
                    value={Math.round(editingTenant.commissionRate * 100)}
                    onChange={(e) =>
                      setEditingTenant({
                        ...editingTenant,
                        commissionRate: Number(e.target.value) / 100,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Penanggung Jawab (FR-1)</label>
                <input
                  type="text"
                  value={editingTenant.ownerName}
                  onChange={(e) =>
                    setEditingTenant({ ...editingTenant, ownerName: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  value={editingTenant.phone}
                  onChange={(e) =>
                    setEditingTenant({ ...editingTenant, phone: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Status Kios (FR-1)</label>
                <select
                  value={editingTenant.status}
                  onChange={(e) =>
                    setEditingTenant({
                      ...editingTenant,
                      status: e.target.value as 'active' | 'closed',
                    })
                  }
                  className="w-full p-2.5 border rounded-xl font-bold"
                >
                  <option value="active">Aktif (Buka)</option>
                  <option value="closed">Tutup / Nonaktif</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TAMBAH KATEGORI (FR-2) ================= */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                Tambah Kategori Menu (FR-2)
              </h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Contoh: Aneka Sayur / Dessert"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Pilihan hidangan pendamping..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
