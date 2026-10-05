import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDateTime, formatRupiah } from '../utils/formatters';
import {
  Store,
  Receipt,
  BarChart3,
  ChefHat,
  Code2,
  Users,
  Settings,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  DollarSign,
  Building,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Utensils,
  Layers,
  Clock,
} from 'lucide-react';

export const BerandaView: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    transactions,
    menus,
    tenants,
    settings,
  } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTransactions = transactions.filter((t) => t.createdAt.slice(0, 10) === todayStr);

  const todayRevenue = todayTransactions.reduce((acc, t) => acc + t.total, 0);
  const todayItemCount = todayTransactions.reduce(
    (acc, t) => acc + t.items.reduce((iSum, it) => iSum + it.quantity, 0),
    0
  );
  const activeTenantCount = tenants.filter((t) => t.status === 'active').length;
  const isAdmin = currentUser?.role === 'admin';

  // Feature Shortcut Cards
  const featureShortcuts = [
    {
      id: 'pos',
      title: 'Kasir POS (Transaksi)',
      desc: 'Pencatatan pesanan multi-tenant, diskon mahasiswa/dosen, pembayaran QRIS & tunai, cetak struk kasir.',
      icon: Receipt,
      color: 'bg-emerald-600 text-white',
      badge: 'Utama',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      action: () => setActiveTab('pos'),
    },
    {
      id: 'laporan',
      title: 'Laporan Penjualan Real-Time',
      desc: 'Rekap omset harian, jumlah item terjual, rekap setoran pengelola per kios, filter tanggal, dan export CSV.',
      icon: BarChart3,
      color: 'bg-teal-600 text-white',
      badge: 'Live',
      badgeColor: 'bg-teal-100 text-teal-800',
      action: () => setActiveTab('laporan'),
    },
    {
      id: 'admin_menu',
      title: 'Katalog & Stok Menu',
      desc: 'CRUD menu makanan, minuman, snack, pengaturan harga, foto opsional, dan kontrol ketersediaan stok.',
      icon: Utensils,
      color: 'bg-amber-600 text-white',
      badge: `${menus.length} Menu`,
      badgeColor: 'bg-amber-100 text-amber-800',
      action: () => setActiveTab('admin_menu'),
    },
    {
      id: 'admin_tenant',
      title: 'Manajemen Kios Tenant',
      desc: 'CRUD data kios mitra stand, penanggung jawab, no. telepon/WA, status aktif, dan persentase setoran.',
      icon: Store,
      color: 'bg-indigo-600 text-white',
      badge: `${activeTenantCount} Aktif`,
      badgeColor: 'bg-indigo-100 text-indigo-800',
      action: () => setActiveTab('admin_menu'),
    },
    {
      id: 'tenant_kitchen',
      title: 'Kitchen Display System (KDS)',
      desc: 'Layar monitor dapur real-time untuk memantau antrian pesanan baru, proses masak, dan pesanan siap.',
      icon: ChefHat,
      color: 'bg-rose-600 text-white',
      badge: 'Dapur',
      badgeColor: 'bg-rose-100 text-rose-800',
      action: () => setActiveTab('tenant_kitchen'),
    },
    {
      id: 'admin_users',
      title: 'Kelola User Kasir (FR-03)',
      desc: 'CRUD akun petugas kasir dan admin, manajemen password, dan aktivasi akun kasir foodcourt.',
      icon: Users,
      color: 'bg-purple-600 text-white',
      badge: isAdmin ? 'Admin' : 'Terkunci',
      badgeColor: isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500',
      action: () => setActiveTab('admin_users'),
      requiresAdmin: true,
    },
    {
      id: 'admin_settings',
      title: 'Pengaturan Sistem & Struk',
      desc: 'Identitas foodcourt, alamat kampus UNUGHA, nomor telepon, logo, dan format penomoran struk (TRX).',
      icon: Settings,
      color: 'bg-slate-700 text-white',
      badge: 'Config',
      badgeColor: 'bg-slate-100 text-slate-700',
      action: () => setActiveTab('admin_settings'),
      requiresAdmin: true,
    },
    {
      id: 'laravel_code',
      title: 'Struktur Laravel 11',
      desc: 'Pohon direktori kasir-unugha/ lengkap dengan Controller, Models, Migrations, Blade views, dan Routes.',
      icon: Code2,
      color: 'bg-red-600 text-white',
      badge: 'Source',
      badgeColor: 'bg-red-100 text-red-800',
      action: () => setActiveTab('laravel_code'),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-emerald-800/80">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Kasir FoodCourt UNUGHA Cilacap</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Selamat Bertugas,{' '}
              <span className="text-amber-400">
                {currentUser?.name || 'Petugas Kasir'}
              </span>
              !
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              Selamat datang di portal utama pengelolaan {settings.foodcourtName || 'FoodCourt UNUGHA'}. 
              Pilih menu di bawah ini untuk mencatat transaksi, memantau laporan real-time, atau mengelola data kios.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-emerald-950/80 text-emerald-200 px-3 py-1 rounded-xl border border-emerald-700 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Hak Akses: <strong className="text-white capitalize">{currentUser?.role || 'Kasir'}</strong>
              </span>

              <span className="bg-emerald-950/80 text-emerald-200 px-3 py-1 rounded-xl border border-emerald-700 flex items-center gap-1.5 font-medium">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                Status: <strong className="text-emerald-300">Buka & Melayani</strong>
              </span>
            </div>
          </div>

          {/* Quick CTA to POS */}
          <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('pos')}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Receipt className="w-5 h-5" />
              <span>Buka Kasir POS Sekarang</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('laporan')}
              className="w-full md:w-auto px-6 py-2.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs border border-emerald-700 transition flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-emerald-300" />
              <span>Lihat Laporan Penjualan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Kilat Hari Ini */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Ringkasan Transaksi Hari Ini ({todayStr})</span>
          </h2>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Real-Time Live
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Omset Hari Ini</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-900 font-mono mt-2">
              {formatRupiah(todayRevenue)}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Transaksi Selesai</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-2">
              {todayTransactions.length} Struk
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Porsi Terjual</span>
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-2">
              {todayItemCount} Porsi
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Kios Aktif</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-purple-900 font-mono mt-2">
              {activeTenantCount} Stand
            </div>
          </div>
        </div>
      </div>

      {/* Grid Menu & Fitur Aplikasi */}
      <div>
        <div className="mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Menu Navigasi & Fitur Lengkap Aplikasi
          </h2>
          <p className="text-xs text-slate-500">
            Klik fitur yang ingin dibuka; Anda dapat kembali ke Beranda ini kapan saja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureShortcuts.map((feat) => {
            const IconComponent = feat.icon;
            const isClickable = !feat.requiresAdmin || isAdmin;

            return (
              <div
                key={feat.id}
                onClick={() => {
                  if (isClickable) feat.action();
                }}
                className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                  isClickable
                    ? 'cursor-pointer hover:border-emerald-400 active:scale-[0.99]'
                    : 'opacity-60 cursor-not-allowed bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${feat.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${feat.badgeColor}`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>{isClickable ? 'Buka Fitur' : 'Hanya Admin'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aktivitas Transaksi Terakhir */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">
              Aktivitas Transaksi Terbaru di FoodCourt
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('laporan')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>Semua Laporan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 4).map((trx) => (
            <div
              key={trx.id}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition"
            >
              <div>
                <div className="font-bold text-slate-800">
                  {trx.invoiceNumber} • {trx.customerName}
                </div>
                <div className="text-[10px] text-slate-400">
                  {formatDateTime(trx.createdAt)} • {trx.tableNumber} • Kasir: {trx.cashierName}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-emerald-800">
                  {formatRupiah(trx.total)}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {trx.paymentMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
