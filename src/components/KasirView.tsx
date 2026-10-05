import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { BackToHomeButton } from './BackToHomeButton';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Utensils,
  ShoppingBag,
  Sparkles,
  Layers,
  Store,
  Tag,
  CreditCard,
  X,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { MenuItem, Transaction } from '../types';

export const KasirView: React.FC = () => {
  const {
    tenants,
    categories,
    menus,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartItemNote,
    clearCart,
    cancelTransaction,
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
    subtotal,
    discountAmount,
    total,
    currentUser,
  } = useApp();

  // Filter states
  const [selectedTenantId, setSelectedTenantId] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Active item note editing
  const [editingNoteMenuId, setEditingNoteMenuId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  // Filtered menu items
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchTenant = selectedTenantId === 'all' || menu.tenantId === selectedTenantId;
      const matchCategory = selectedCategoryId === 'all' || menu.categoryId === selectedCategoryId;
      const matchSearch =
        searchQuery.trim() === '' ||
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTenant && matchCategory && matchSearch;
    });
  }, [menus, selectedTenantId, selectedCategoryId, searchQuery]);

  const handleOpenNoteModal = (menuId: string, currentNote?: string) => {
    setEditingNoteMenuId(menuId);
    setNoteDraft(currentNote || '');
  };

  const handleSaveNote = () => {
    if (editingNoteMenuId) {
      updateCartItemNote(editingNoteMenuId, noteDraft);
      setEditingNoteMenuId(null);
    }
  };

  const handlePaymentSuccess = (trx: Transaction) => {
    setIsPaymentModalOpen(false);
    setLatestTransaction(trx);
    setIsReceiptModalOpen(true);
  };

  const handleNewOrder = () => {
    setIsReceiptModalOpen(false);
    setLatestTransaction(null);
  };

  const totalItemsCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100dvh-4rem)]">
      {/* Mobile Screen Switcher Bar (Phones & Small Tablets) */}
      <div className="lg:hidden bg-emerald-950 p-2 border-b border-emerald-800 shrink-0">
        <div className="flex items-center gap-1.5 max-w-lg mx-auto">
          <BackToHomeButton variant="light" label="Beranda" />

          <button
            onClick={() => setMobileTab('catalog')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'catalog'
                ? 'bg-amber-400 text-emerald-950 shadow-sm'
                : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Katalog ({filteredMenus.length})</span>
          </button>

          <button
            onClick={() => setMobileTab('cart')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'cart'
                ? 'bg-amber-400 text-emerald-950 shadow-sm'
                : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pesanan ({totalItemsCount})</span>
            {cart.length > 0 && (
              <span className="ml-1 bg-emerald-950 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {formatRupiah(total)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* LEFT: Menu Selection Area */}
      <div
        className={`flex-1 flex-col min-w-0 bg-slate-100 overflow-hidden ${
          mobileTab === 'cart' ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {/* Top Search & Filter Bar */}
        <div className="bg-white border-b border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Back to Home Button & Search Input */}
            <div className="flex items-center gap-2 flex-1">
              <BackToHomeButton />
              
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu, paket santri, minuman... (Ketik nama / kode)"
                  className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stat */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="font-semibold text-emerald-800">{filteredMenus.length}</span>
              <span>menu tersedia</span>
            </div>
          </div>

          {/* Tenant Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <Store className="w-3 h-3" /> Stand:
            </span>
            <button
              onClick={() => setSelectedTenantId('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition ${
                selectedTenantId === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua Stand ({menus.length})
            </button>
            {tenants.map((t) => {
              const count = menus.filter((m) => m.tenantId === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTenantId(t.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition flex items-center gap-1.5 ${
                    selectedTenantId === t.id
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{t.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedTenantId === t.id
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Kategori:
            </span>
            {categories.map((c) => {
              const isSelected =
                (c.id === 'cat_all' && selectedCategoryId === 'all') ||
                selectedCategoryId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() =>
                    setSelectedCategoryId(c.id === 'cat_all' ? 'all' : c.id)
                  }
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition ${
                    isSelected
                      ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredMenus.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <Utensils className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">Tidak ada menu yang sesuai</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Coba ubah kata kunci pencarian atau pilih stand/kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredMenus.map((item) => {
                const tenant = tenants.find((t) => t.id === item.tenantId);
                const cartMatch = cart.find((c) => c.menuItem.id === item.id);
                const currentQuantityInCart = cartMatch?.quantity || 0;
                const isOutOfStock = !item.isAvailable || item.stock <= 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isOutOfStock) addToCart(item);
                    }}
                    className={`group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer relative ${
                      isOutOfStock ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'active:scale-[0.98]'
                    }`}
                  >
                    {/* Top Image & Badges */}
                    <div className="relative h-28 sm:h-32 bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />

                      {/* Best Seller Badge */}
                      {item.isBestSeller && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Favorit</span>
                        </div>
                      )}

                      {/* Stand Tag */}
                      <div className="absolute bottom-2 left-2 bg-emerald-950/85 backdrop-blur-xs text-emerald-200 text-[9px] font-semibold px-2 py-0.5 rounded-md">
                        {tenant?.name || 'FoodCourt UNUGHA'}
                      </div>

                      {/* In-cart count badge */}
                      {currentQuantityInCart > 0 && (
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                          {currentQuantityInCart}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{item.sku}</span>
                          <span>{item.calories || ''}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 mt-0.5 group-hover:text-emerald-800 transition">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Price & Stock info */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block -mb-0.5">Harga</span>
                          <span className="text-xs sm:text-sm font-extrabold text-emerald-800">
                            {formatRupiah(item.price)}
                          </span>
                        </div>

                        {isOutOfStock ? (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                            Habis
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">
                              Sisa: <strong className="text-slate-700">{item.stock}</strong>
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
                              <Plus className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar on Mobile when items in cart & viewing catalog */}
      {cart.length > 0 && mobileTab === 'catalog' && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 p-3 z-30 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setMobileTab('cart')}
              className="w-full bg-emerald-950/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-emerald-600 flex items-center justify-between active:scale-[0.98] transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-xs">
                  {totalItemsCount}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white">{formatRupiah(total)}</div>
                  <div className="text-[10px] text-emerald-300">{cart.length} menu dipilih</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-xs">
                <span>Buka Keranjang & Bayar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* RIGHT: Order Cart & Billing Sidebar */}
      <div
        className={`w-full lg:w-96 bg-white border-l border-slate-200 flex-col h-full shadow-lg z-10 ${
          mobileTab === 'catalog' ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {/* Cart Header */}
        <div className="p-3.5 sm:p-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BackToHomeButton variant="light" label="Beranda" />
            <button
              onClick={() => setMobileTab('catalog')}
              className="lg:hidden p-1.5 rounded-lg bg-emerald-800 text-amber-300 flex items-center gap-1 text-xs font-bold border border-emerald-700"
              title="Kembali ke Katalog Menu"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center border border-emerald-700">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Pesanan Kasir</h3>
              <p className="text-[10px] text-emerald-200">
                Kasir: {currentUser?.name || 'Kasir UNUGHA'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-emerald-800 text-amber-300 px-2.5 py-1 rounded-full font-bold">
            {totalItemsCount} item
          </span>
        </div>

        {/* Customer & Order Settings */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5">
          {/* Order Type Toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => setOrderType('dine_in')}
              className={`py-1.5 rounded-lg transition ${
                orderType === 'dine_in'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍽️ Makan di Tempat (Dine In)
            </button>
            <button
              onClick={() => setOrderType('take_away')}
              className={`py-1.5 rounded-lg transition ${
                orderType === 'take_away'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛍️ Bungkus (Take Away)
            </button>
          </div>

          {/* Customer Name & Table Number */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nama Pemesan
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Misal: Faiz (TI)"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {orderType === 'dine_in' ? 'Nomor Meja' : 'Label Pesanan'}
              </label>
              {orderType === 'dine_in' ? (
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 font-medium bg-white"
                >
                  <option value="Meja 01">Meja 01</option>
                  <option value="Meja 02">Meja 02</option>
                  <option value="Meja 03">Meja 03</option>
                  <option value="Meja 04">Meja 04</option>
                  <option value="Meja 05">Meja 05</option>
                  <option value="Meja 06">Meja 06</option>
                  <option value="Gazebo Luar 01">Gazebo Luar 01</option>
                  <option value="Gazebo Luar 02">Gazebo Luar 02</option>
                  <option value="VIP Dosen">VIP Dosen & Tamu</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Take Away / Antar"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 font-medium bg-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 p-4">
              <ShoppingBag className="w-10 h-10 stroke-[1.2] mb-1.5 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Keranjang Masih Kosong</p>
              <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5">
                Pilih menu di sebelah kiri untuk menambahkan ke pesanan
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const tenant = tenants.find((t) => t.id === item.menuItem.tenantId);
              const itemTotal = item.menuItem.price * item.quantity;

              return (
                <div
                  key={item.menuItem.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                          {tenant?.standNumber}
                        </span>
                        <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                          {item.menuItem.name}
                        </h5>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {formatRupiah(item.menuItem.price)} / porsi
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity & Note Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    {/* Add note button */}
                    <button
                      onClick={() => handleOpenNoteModal(item.menuItem.id, item.note)}
                      className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded-md transition ${
                        item.note
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 font-medium'
                          : 'text-slate-400 hover:text-slate-600 bg-slate-50'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span className="line-clamp-1 max-w-[110px]">
                        {item.note || '+ Catatan (level/selera)'}
                      </span>
                    </button>

                    {/* Quantity counter */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.menuItem.id, item.quantity - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs font-mono text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.menuItem.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.menuItem.stock}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-emerald-800 font-mono w-16 text-right">
                        {formatRupiah(itemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo Diskon UNUGHA Selector */}
        <div className="p-3 bg-amber-50/70 border-t border-amber-200/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-700" /> Diskon / Promo UNUGHA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => setDiscountType('none')}
              className={`py-1 px-2 rounded-lg border text-center transition ${
                discountType === 'none'
                  ? 'bg-amber-600 text-white font-bold border-amber-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-100/50'
              }`}
            >
              Tanpa Diskon
            </button>

            <button
              onClick={() => setDiscountType('mahasiswa_10')}
              className={`py-1 px-2 rounded-lg border text-center transition ${
                discountType === 'mahasiswa_10'
                  ? 'bg-amber-600 text-white font-bold border-amber-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-100/50'
              }`}
            >
              🎓 Mahasiswa UNUGHA (10%)
            </button>

            <button
              onClick={() => setDiscountType('dosen_15')}
              className={`py-1 px-2 rounded-lg border text-center transition ${
                discountType === 'dosen_15'
                  ? 'bg-amber-600 text-white font-bold border-amber-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-100/50'
              }`}
            >
              💼 Dosen & Karyawan (15%)
            </button>

            <button
              onClick={() => setDiscountType('custom')}
              className={`py-1 px-2 rounded-lg border text-center transition ${
                discountType === 'custom'
                  ? 'bg-amber-600 text-white font-bold border-amber-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-100/50'
              }`}
            >
              ⚙️ Diskon Khusus
            </button>
          </div>

          {discountType === 'custom' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-slate-600">Nominal Diskon:</span>
              <input
                type="number"
                value={customDiscount || ''}
                onChange={(e) => setCustomDiscount(Number(e.target.value) || 0)}
                placeholder="Rp 0"
                className="w-28 px-2 py-1 text-xs border rounded-lg bg-white"
              />
            </div>
          )}
        </div>

        {/* Financial Breakdown & Pay Action */}
        <div className="p-4 pb-20 lg:pb-4 bg-white border-t border-slate-200 space-y-2 shadow-lg">
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Diskon Kampus</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Pajak & Layanan FoodCourt</span>
              <span className="text-emerald-700 font-medium">Rp 0 (Gratis)</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
              <span className="text-xl font-black text-emerald-800 font-mono">
                {formatRupiah(total)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                if (cart.length > 0) {
                  if (window.confirm('Batalkan transaksi saat ini dan reset semua pesanan?')) {
                    cancelTransaction();
                  }
                }
              }}
              disabled={cart.length === 0}
              className="px-3 py-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center gap-1.5 text-xs font-bold"
              title="Batal Transaksi Sebelum Disimpan (FR-7)"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Batal Transaksi</span>
            </button>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>Bayar ({formatRupiah(total)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Note Editing Modal */}
      {editingNoteMenuId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800">Catatan Khusus Pesanan</h4>
              <button
                onClick={() => setEditingNoteMenuId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1.5">
                Instruksi khusus untuk dapur stand (contoh: pedas level 5, jangan pakai es, bungkus pisah kuah):
              </label>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Tulis catatan..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingNoteMenuId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Thermal Receipt Print Modal */}
      <ReceiptModal
        transaction={latestTransaction}
        onClose={() => setIsReceiptModalOpen(false)}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
};
