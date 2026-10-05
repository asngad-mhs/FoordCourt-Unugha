import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatDateTime, formatRupiah, formatTime } from '../utils/formatters';
import { ReceiptModal } from './ReceiptModal';
import { BackToHomeButton } from './BackToHomeButton';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  CreditCard,
  DollarSign,
  Users,
  Store,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  QrCode,
  Banknote,
  Search,
  Eye,
  Receipt,
  PackageCheck,
  Building,
} from 'lucide-react';
import { Transaction } from '../types';

export const LaporanView: React.FC = () => {
  const { transactions, tenants } = useApp();

  // Filters (FR-2: Filter laporan per tanggal & per tenant)
  const todayStr = new Date().toISOString().slice(0, 10);
  const [filterDateMode, setFilterDateMode] = useState<'today' | 'all' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [filterTenant, setFilterTenant] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [searchInvoice, setSearchInvoice] = useState<string>('');
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Date filter
      const tDate = t.createdAt.slice(0, 10);
      let matchDate = true;
      if (filterDateMode === 'today') {
        matchDate = tDate === todayStr;
      } else if (filterDateMode === 'custom') {
        matchDate = tDate === customDate;
      }

      // Tenant filter
      const matchTenant =
        filterTenant === 'all' ||
        t.tenantSplits.some((s) => s.tenantId === filterTenant);

      // Payment filter
      const matchPayment = filterPayment === 'all' || t.paymentMethod === filterPayment;

      // Search filter
      const matchSearch =
        searchInvoice === '' ||
        t.invoiceNumber.toLowerCase().includes(searchInvoice.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchInvoice.toLowerCase()) ||
        t.tableNumber.toLowerCase().includes(searchInvoice.toLowerCase());

      return matchDate && matchTenant && matchPayment && matchSearch;
    });
  }, [transactions, filterDateMode, customDate, todayStr, filterTenant, filterPayment, searchInvoice]);

  // Aggregate Metrics (FR-1: total transaksi, total pendapatan, jumlah item terjual)
  const totalPendapatan = filteredTransactions.reduce((acc, t) => acc + t.total, 0);
  const totalTransaksi = filteredTransactions.length;

  const totalItemTerjual = filteredTransactions.reduce((acc, t) => {
    return (
      acc +
      t.items.reduce((iAcc, item) => {
        if (filterTenant !== 'all' && item.tenantId !== filterTenant) return iAcc;
        return iAcc + item.quantity;
      }, 0)
    );
  }, 0);

  // FR-4: Total Setoran ke Pengelola (Komisi)
  const totalSetoranPengelola = filteredTransactions.reduce((acc, t) => {
    return (
      acc +
      t.tenantSplits.reduce((sAcc, s) => {
        if (filterTenant !== 'all' && s.tenantId !== filterTenant) return sAcc;
        return sAcc + s.commission;
      }, 0)
    );
  }, 0);

  // Rekap per Tenant (FR-4: rekap per tenant, setoran ke pengelola)
  const tenantStats = useMemo(() => {
    const map = new Map<
      string,
      {
        tenantId: string;
        tenantName: string;
        standNumber: string;
        ownerName: string;
        commissionRate: number;
        totalOrders: number;
        totalItemsSold: number;
        grossRevenue: number;
        setoranPengelola: number;
        netRevenue: number;
      }
    >();

    tenants.forEach((t) => {
      map.set(t.id, {
        tenantId: t.id,
        tenantName: t.name,
        standNumber: t.standNumber,
        ownerName: t.ownerName,
        commissionRate: t.commissionRate,
        totalOrders: 0,
        totalItemsSold: 0,
        grossRevenue: 0,
        setoranPengelola: 0,
        netRevenue: 0,
      });
    });

    filteredTransactions.forEach((t) => {
      t.tenantSplits.forEach((split) => {
        const existing = map.get(split.tenantId);
        if (existing) {
          existing.grossRevenue += split.subtotal;
          existing.setoranPengelola += split.commission;
          existing.netRevenue += split.netAmount;
          existing.totalOrders += 1;
        }
      });

      t.items.forEach((item) => {
        const existing = map.get(item.tenantId);
        if (existing) {
          existing.totalItemsSold += item.quantity;
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => b.grossRevenue - a.grossRevenue);
  }, [filteredTransactions, tenants]);

  // Hourly Distribution for the filtered dataset
  const hourlyData = useMemo(() => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    return hours.map((hour) => {
      const trxInHour = filteredTransactions.filter((t) => {
        const d = new Date(t.createdAt);
        return d.getHours() === hour;
      });
      const revenue = trxInHour.reduce((acc, t) => acc + t.total, 0);
      return {
        hourLabel: `${String(hour).padStart(2, '0')}:00`,
        revenue,
        count: trxInHour.length,
      };
    });
  }, [filteredTransactions]);

  const maxHourlyRevenue = Math.max(...hourlyData.map((h) => h.revenue), 1);

  // FR-3: Export laporan ke CSV/Excel
  const handleExportCsv = () => {
    const headers = [
      'No. Invoice',
      'Tanggal Transaksi',
      'Jam',
      'Kasir',
      'Pelanggan',
      'Tipe / Meja',
      'Subtotal (Rp)',
      'Diskon (Rp)',
      'Total Akhir (Rp)',
      'Metode Pembayaran',
      'Jumlah Item Terjual',
      'Daftar Menu & Qty',
    ];

    const rows = filteredTransactions.map((t) => {
      const itemsCount = t.items.reduce((sum, it) => sum + it.quantity, 0);
      const itemsStr = t.items.map((it) => `${it.menuName} (x${it.quantity})`).join('; ');
      return [
        `"${t.invoiceNumber}"`,
        `"${t.createdAt.slice(0, 10)}"`,
        `"${formatTime(t.createdAt)}"`,
        `"${t.cashierName}"`,
        `"${t.customerName}"`,
        `"${t.tableNumber}"`,
        t.subtotal,
        t.discountAmount,
        t.total,
        `"${t.paymentMethod.toUpperCase()}"`,
        itemsCount,
        `"${itemsStr}"`,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateLabel =
      filterDateMode === 'today'
        ? todayStr
        : filterDateMode === 'custom'
        ? customDate
        : 'Semua_Tanggal';
    link.setAttribute('download', `Laporan_Penjualan_UNUGHA_${dateLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <BackToHomeButton />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Laporan Penjualan Harian Real-Time
              </h1>
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Live Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              FR-1: Total transaksi, total pendapatan, jumlah item terjual & FR-4: Rekap setoran pengelola
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCsv}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition active:scale-[0.98]"
            title="Download file CSV / Excel (FR-3)"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel (FR-3)</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* FR-2: Filter Tanggal & Tenant Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>FR-2: Filter Laporan Berdasarkan Tanggal & Kios Tenant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Tanggal Controls */}
          <div className="sm:col-span-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterDateMode('today')}
              className={`px-3 py-2 rounded-xl font-bold transition ${
                filterDateMode === 'today'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Hari Ini ({todayStr})
            </button>

            <button
              onClick={() => setFilterDateMode('all')}
              className={`px-3 py-2 rounded-xl font-bold transition ${
                filterDateMode === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua Tanggal
            </button>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setFilterDateMode('custom');
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Tenant Selector */}
          <div className="sm:col-span-3">
            <select
              value={filterTenant}
              onChange={(e) => setFilterTenant(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">Semua Kios / Stand Mitra</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.standNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Selector */}
          <div className="sm:col-span-3">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">Semua Metode Pembayaran</option>
              <option value="qris">📱 QRIS UNUGHA Pay</option>
              <option value="cash">💵 Uang Tunai (Cash)</option>
              <option value="ewallet">💳 E-Wallet / VA</option>
            </select>
          </div>
        </div>
      </div>

      {/* FR-1: 4 KPI Cards: Total Pendapatan, Total Transaksi, Jumlah Item Terjual, Setoran Pengelola */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pendapatan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pendapatan (Omset)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-900 font-mono">
              {formatRupiah(totalPendapatan)}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              FR-1: Pendapatan Lunas
            </p>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Transaksi
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {totalTransaksi} Transaksi
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              FR-1: Jumlah struk tercatat
            </p>
          </div>
        </div>

        {/* Jumlah Item Terjual (FR-1) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jumlah Item Terjual
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-sky-900 font-mono">
              {totalItemTerjual} Porsi
            </div>
            <p className="text-[11px] text-sky-700 font-semibold mt-1">
              FR-1: Makanan & Minuman
            </p>
          </div>
        </div>

        {/* Setoran ke Pengelola (FR-4) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Setoran ke Pengelola (UNUGHA)
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-900 font-mono">
              {formatRupiah(totalSetoranPengelola)}
            </div>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">
              FR-4: Komisi bagi hasil sewa
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Sales Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              Grafik Penjualan per Jam
            </h3>
            <p className="text-xs text-slate-500">
              Distribusi transaksi jam ramai di FoodCourt UNUGHA
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            Jam Operasional: 08:00 - 20:00 WIB
          </div>
        </div>

        <div className="h-48 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-2 border-b border-slate-200 overflow-x-auto">
          {hourlyData.map((slot) => {
            const heightPercent =
              slot.revenue > 0 ? Math.max(12, Math.round((slot.revenue / maxHourlyRevenue) * 100)) : 4;
            const isPeak = slot.revenue === maxHourlyRevenue && slot.revenue > 0;

            return (
              <div
                key={slot.hourLabel}
                className="flex-1 min-w-[42px] flex flex-col items-center gap-2 group h-full justify-end"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-md px-2 py-1 absolute -translate-y-12 pointer-events-none z-20 whitespace-nowrap shadow-md">
                  <div className="font-bold">{slot.hourLabel}</div>
                  <div>{formatRupiah(slot.revenue)}</div>
                  <div className="text-emerald-300">{slot.count} transaksi</div>
                </div>

                {slot.revenue > 0 && (
                  <span className="text-[9px] font-bold text-slate-600 font-mono hidden md:block">
                    {Math.round(slot.revenue / 1000)}k
                  </span>
                )}

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isPeak
                      ? 'bg-gradient-to-t from-emerald-800 to-amber-400 shadow-sm'
                      : slot.revenue > 0
                      ? 'bg-emerald-600 group-hover:bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />

                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                  {slot.hourLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FR-4: Rekap per Tenant (Setoran ke Pengelola) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-700" />
              FR-4: Rekap per Tenant (Setoran ke Pengelola)
            </h3>
            <p className="text-xs text-slate-500">
              Rincian komisi setoran bagi hasil foodcourt dan pendapatan bersih tiap kios mitra
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
            {tenantStats.length} Stand Kios
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama Kios & Stand</th>
                <th className="px-4 py-3.5">Penanggung Jawab</th>
                <th className="px-4 py-3.5 text-center">Porsi Terjual</th>
                <th className="px-4 py-3.5 text-center">Transaksi</th>
                <th className="px-4 py-3.5 text-right">Omset Kotor</th>
                <th className="px-4 py-3.5 text-right font-bold text-purple-800">
                  Setoran ke Pengelola (FR-4)
                </th>
                <th className="px-5 py-3.5 text-right font-black text-emerald-900">
                  Pendapatan Bersih Kios
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenantStats.map((stat, idx) => (
                <tr key={stat.tenantId} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800">{stat.tenantName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {stat.standNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-700">
                    {stat.ownerName}
                  </td>

                  <td className="px-4 py-3.5 text-center font-bold text-slate-700">
                    {stat.totalItemsSold} porsi
                  </td>

                  <td className="px-4 py-3.5 text-center text-slate-600">
                    {stat.totalOrders} kali
                  </td>

                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800 font-mono">
                    {formatRupiah(stat.grossRevenue)}
                  </td>

                  <td className="px-4 py-3.5 text-right text-purple-700 font-bold font-mono">
                    {formatRupiah(stat.setoranPengelola)}
                    <span className="text-[9px] text-purple-500 font-normal block">
                      ({Math.round(stat.commissionRate * 100)}%)
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right font-black text-emerald-800 text-sm font-mono">
                    {formatRupiah(stat.netRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Riwayat Transaksi Terfilter ({filteredTransactions.length})
            </h3>
            <p className="text-xs text-slate-500">
              Daftar transaksi yang sesuai dengan filter tanggal, kios, dan metode bayar
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Cari No. Struk / Pelanggan / Meja..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">No. Struk & Waktu</th>
                <th className="px-4 py-3.5">Pelanggan & Meja</th>
                <th className="px-4 py-3.5">Daftar Menu (Qty)</th>
                <th className="px-4 py-3.5">Metode Bayar</th>
                <th className="px-4 py-3.5 text-right">Total Transaksi</th>
                <th className="px-5 py-3.5 text-center">Aksi Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ditemukan data transaksi untuk filter ini.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-slate-800">
                        {trx.invoiceNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatDateTime(trx.createdAt)} • Kasir: {trx.cashierName}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">{trx.customerName}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">
                        {trx.tableNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[220px]">
                      <div className="text-[11px] text-slate-600 line-clamp-1">
                        {trx.items.map((i) => `${i.menuName} (x${i.quantity})`).join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trx.items.reduce((sum, it) => sum + it.quantity, 0)} item total
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          trx.paymentMethod === 'qris'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : trx.paymentMethod === 'cash'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {trx.paymentMethod === 'qris' && <QrCode className="w-3 h-3" />}
                        {trx.paymentMethod === 'cash' && <Banknote className="w-3 h-3" />}
                        {trx.paymentMethod.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-black font-mono text-emerald-800">
                      {formatRupiah(trx.total)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedTransactionForReceipt(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
                        title="Lihat & Cetak Struk (FR-6)"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Struk Modal */}
      {selectedTransactionForReceipt && (
        <ReceiptModal
          transaction={selectedTransactionForReceipt}
          onClose={() => setSelectedTransactionForReceipt(null)}
          onNewOrder={() => setSelectedTransactionForReceipt(null)}
        />
      )}
    </div>
  );
};
