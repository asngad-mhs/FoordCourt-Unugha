import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/formatters';
import {
  ChefHat,
  Clock,
  CheckCircle,
  Flame,
  Bell,
  Utensils,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Transaction } from '../types';
import { BackToHomeButton } from './BackToHomeButton';

export const TenantKitchenView: React.FC = () => {
  const { transactions, tenants, updateKitchenStatus } = useApp();
  const [selectedTenantId, setSelectedTenantId] = useState<string>('all');
  const [mobileStatusTab, setMobileStatusTab] = useState<'all' | 'diterima' | 'dimasak' | 'siap' | 'selesai'>('all');

  // Filter transactions that have items for this tenant
  const activeOrders = transactions.filter((t) => {
    if (selectedTenantId === 'all') return true;
    return t.items.some((item) => item.tenantId === selectedTenantId);
  });

  const diterimaOrders = activeOrders.filter((t) => t.kitchenStatus === 'diterima');
  const dimasakOrders = activeOrders.filter((t) => t.kitchenStatus === 'dimasak');
  const siapOrders = activeOrders.filter((t) => t.kitchenStatus === 'siap');
  const selesaiOrders = activeOrders.filter((t) => t.kitchenStatus === 'selesai');

  const renderOrderCard = (
    order: Transaction,
    nextStatus?: 'dimasak' | 'siap' | 'selesai',
    nextActionLabel?: string
  ) => {
    // Show only items belonging to selected tenant if a tenant is selected, or all items
    const relevantItems =
      selectedTenantId === 'all'
        ? order.items
        : order.items.filter((i) => i.tenantId === selectedTenantId);

    if (relevantItems.length === 0) return null;

    return (
      <div
        key={order.id}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 hover:border-slate-300 transition"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-slate-900">{order.tableNumber}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                #{order.invoiceNumber.slice(-3)}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Pemesan: <strong>{order.customerName}</strong>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatTime(order.createdAt)}
          </span>
        </div>

        {/* Card Items */}
        <div className="space-y-1.5">
          {relevantItems.map((item) => (
            <div key={item.id} className="text-xs">
              <div className="flex justify-between items-start font-semibold text-slate-800">
                <span>
                  {item.quantity}x {item.menuName}
                </span>
                {selectedTenantId === 'all' && (
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">
                    {item.tenantName}
                  </span>
                )}
              </div>
              {item.note && (
                <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-0.5 font-medium">
                  Catatan: {item.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Advance status button */}
        {nextStatus && (
          <button
            onClick={() => updateKitchenStatus(order.id, nextStatus)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <span>{nextActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <BackToHomeButton />
          <div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-emerald-700" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Kitchen Display System (KDS) Stand
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Layar dapur real-time untuk koki & staf stand melihat antrian pesanan yang masuk
            </p>
          </div>
        </div>

        {/* Tenant Filter Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 text-slate-800"
          >
            <option value="all">Semua Stand Mitra (Global)</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.standNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Kitchen Tabs (Phones) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setMobileStatusTab('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            mobileStatusTab === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Semua Tahap ({activeOrders.length})
        </button>
        <button
          onClick={() => setMobileStatusTab('diterima')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            mobileStatusTab === 'diterima'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Baru ({diterimaOrders.length})
        </button>
        <button
          onClick={() => setMobileStatusTab('dimasak')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            mobileStatusTab === 'dimasak'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Dimasak ({dimasakOrders.length})
        </button>
        <button
          onClick={() => setMobileStatusTab('siap')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            mobileStatusTab === 'siap'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Siap ({siapOrders.length})
        </button>
        <button
          onClick={() => setMobileStatusTab('selesai')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            mobileStatusTab === 'selesai'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Selesai ({selesaiOrders.length})
        </button>
      </div>

      {/* 4 Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kolom 1: Pesanan Masuk (Diterima) */}
        <div className={`space-y-3 ${mobileStatusTab !== 'all' && mobileStatusTab !== 'diterima' ? 'hidden md:block' : 'block'}`}>
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wider">
              <Bell className="w-4 h-4 text-sky-600 animate-bounce" />
              <span>1. Pesanan Baru</span>
            </div>
            <span className="bg-sky-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full">
              {diterimaOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {diterimaOrders.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Tidak ada pesanan baru
              </div>
            ) : (
              diterimaOrders.map((ord) => renderOrderCard(ord, 'dimasak', 'Mulai Masak'))
            )}
          </div>
        </div>

        {/* Kolom 2: Sedang Dimasak */}
        <div className={`space-y-3 ${mobileStatusTab !== 'all' && mobileStatusTab !== 'dimasak' ? 'hidden md:block' : 'block'}`}>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>2. Sedang Dimasak</span>
            </div>
            <span className="bg-amber-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full">
              {dimasakOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {dimasakOrders.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Tidak ada yang sedang dimasak
              </div>
            ) : (
              dimasakOrders.map((ord) => renderOrderCard(ord, 'siap', 'Tandai Siap'))
            )}
          </div>
        </div>

        {/* Kolom 3: Siap Diambil / Diantar */}
        <div className={`space-y-3 ${mobileStatusTab !== 'all' && mobileStatusTab !== 'siap' ? 'hidden md:block' : 'block'}`}>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>3. Siap Diantar / Ambil</span>
            </div>
            <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full">
              {siapOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {siapOrders.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Tidak ada pesanan menunggu diambil
              </div>
            ) : (
              siapOrders.map((ord) => renderOrderCard(ord, 'selesai', 'Selesai Disajikan'))
            )}
          </div>
        </div>

        {/* Kolom 4: Selesai */}
        <div className={`space-y-3 ${mobileStatusTab !== 'all' && mobileStatusTab !== 'selesai' ? 'hidden md:block' : 'block'}`}>
          <div className="bg-slate-200/80 border border-slate-300 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>4. Selesai Hari Ini</span>
            </div>
            <span className="bg-slate-700 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full">
              {selesaiOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {selesaiOrders.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Belum ada pesanan selesai
              </div>
            ) : (
              selesaiOrders.slice(0, 5).map((ord) => renderOrderCard(ord))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
