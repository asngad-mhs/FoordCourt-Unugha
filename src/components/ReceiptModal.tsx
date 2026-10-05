import React from 'react';
import { Transaction } from '../types';
import { formatDateTime, formatRupiah } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { Printer, CheckCircle2, X, Store, Sparkles, Home } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  onNewOrder,
}) => {
  const { settings, setActiveTab } = useApp();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    onClose();
    setActiveTab('beranda');
  };

  // Group items by tenant for clarity
  const itemsByTenant = transaction.items.reduce<Record<string, typeof transaction.items>>(
    (acc, it) => {
      if (!acc[it.tenantName]) {
        acc[it.tenantName] = [];
      }
      acc[it.tenantName].push(it);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header alert */}
        <div className="bg-emerald-700 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-sm">Pembayaran Berhasil!</h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-100">
                Pesanan telah dicatat dan siap dicetak (FR-6)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Receipt Paper Container */}
        <div className="p-4 sm:p-6 bg-slate-100 flex justify-center flex-1 overflow-y-auto">
          <div
            id="thermal-receipt"
            className="w-full max-w-[340px] bg-white p-5 rounded-md shadow-md border border-slate-200 font-mono text-[11px] text-slate-800 space-y-3 leading-tight"
          >
            {/* Header Brand (FR-1 Pengaturan) */}
            <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300">
              {settings.logoUrl && (
                <div className="flex justify-center mb-1">
                  <img
                    src={settings.logoUrl}
                    alt="Logo Foodcourt"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5 font-sans font-extrabold text-sm text-emerald-800 uppercase">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>{settings.foodcourtName || 'FOODCOURT UNUGHA'}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-sans">
                {settings.campusName || 'Universitas Nahdlatul Ulama Al Ghazali'}
              </p>
              <p className="text-[9px] text-slate-400 font-sans">
                {settings.address || 'Jl. Oya No. 9, Kroya, Cilacap, Jawa Tengah'}
              </p>
              {settings.phone && (
                <p className="text-[9px] text-slate-400 font-sans">
                  Telp/WA: {settings.phone}
                </p>
              )}
            </div>

            {/* Transaction Meta (FR-6) */}
            <div className="space-y-1 text-[10px] text-slate-600 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>No. Transaksi</span>
                <span className="font-bold text-slate-900">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal & Waktu</span>
                <span>{formatDateTime(transaction.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nama Kasir</span>
                <span className="font-semibold text-slate-800">{transaction.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan</span>
                <span className="font-bold text-slate-900">{transaction.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipe / Meja</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {transaction.tableNumber} ({transaction.orderType === 'dine_in' ? 'Dine In' : 'Take Away'})
                </span>
              </div>
            </div>

            {/* Items by Tenant (FR-6: nama menu, qty, harga) */}
            <div className="space-y-3 py-1">
              {Object.entries(itemsByTenant).map(([tenantName, items]) => (
                <div key={tenantName} className="space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-1 py-0.5 rounded">
                    ★ Stand: {tenantName}
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="pl-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">{item.menuName}</span>
                        <span>{formatRupiah(item.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>
                          {item.quantity} x {formatRupiah(item.price)}
                        </span>
                        {item.note && (
                          <span className="italic text-slate-500 line-clamp-1">
                            ({item.note})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Payment Summary (FR-6: total, bayar, kembali) */}
            <div className="space-y-1 pt-2 border-t border-dashed border-slate-300 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal Pesanan</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>

              {transaction.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(transaction.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL AKHIR</span>
                <span className="text-emerald-700">{formatRupiah(transaction.total)}</span>
              </div>

              <div className="flex justify-between pt-1">
                <span>Metode Pembayaran</span>
                <span className="uppercase font-bold text-slate-800">
                  {transaction.paymentMethod === 'qris'
                    ? 'QRIS UNUGHA PAY'
                    : transaction.paymentMethod.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Jumlah Dibayar</span>
                <span>{formatRupiah(transaction.amountPaid)}</span>
              </div>

              <div className="flex justify-between font-bold text-slate-900">
                <span>Kembalian</span>
                <span>{formatRupiah(transaction.change)}</span>
              </div>
            </div>

            {/* Barcode & Footer note (FR-1 Pengaturan) */}
            <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1 font-sans">
              <div className="flex justify-center py-1">
                <div className="h-7 w-44 bg-slate-800 flex items-center justify-around px-1 text-[8px] text-white font-mono tracking-widest">
                  ||| | || |||| | ||| | |||
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-700">
                {settings.receiptFooter || 'Simpan struk ini untuk pengambilan makanan di stand.'}
              </p>
              <p className="text-[9px] text-slate-400 italic">
                Terima kasih atas kunjungan Anda. Berkah & Sehat Selalu!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Struk (Thermal)</span>
          </button>

          <button
            onClick={onNewOrder}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
