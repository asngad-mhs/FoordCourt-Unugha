import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import {
  QrCode,
  Banknote,
  Smartphone,
  CreditCard,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod, Transaction } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trx: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { total, subtotal, discountAmount, discountType, createTransaction, cart } = useApp();

  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('qris');
  const [cashGiven, setCashGiven] = useState<number>(total);
  const [customCashInput, setCustomCashInput] = useState<string>(String(total));
  const [qrisCountdown, setQrisCountdown] = useState<number>(180); // 3 minutes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync cash default with total when total changes
  useEffect(() => {
    if (isOpen) {
      setCashGiven(total);
      setCustomCashInput(String(total));
      setQrisCountdown(180);
    }
  }, [isOpen, total]);

  // Countdown timer for QRIS
  useEffect(() => {
    if (!isOpen || activeMethod !== 'qris') return;
    const timer = setInterval(() => {
      setQrisCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, activeMethod]);

  if (!isOpen) return null;

  const quickCashOptions = [
    { label: 'Uang Pas', value: total },
    { label: 'Rp 20.000', value: 20000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 200.000', value: 200000 },
  ];

  const handleCashOptionClick = (val: number) => {
    setCashGiven(val);
    setCustomCashInput(String(val));
  };

  const handleCustomCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = Number(raw) || 0;
    setCustomCashInput(raw);
    setCashGiven(num);
  };

  const kembalian = Math.max(0, cashGiven - total);
  const isCashInsufficient = activeMethod === 'cash' && cashGiven < total;

  const handleConfirmPayment = () => {
    if (cart.length === 0) return;

    if (activeMethod === 'cash' && isCashInsufficient) {
      alert('Uang yang dibayarkan kurang dari total pesanan!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const amountPaid = activeMethod === 'cash' ? cashGiven : total;
      const trx = createTransaction(activeMethod, amountPaid);

      setIsProcessing(false);

      if (trx) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#059669', '#10b981', '#fbbf24', '#f59e0b'],
          });
        } catch {
          // ignore
        }
        onSuccess(trx);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center border border-emerald-700">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Proses Pembayaran FoodCourt</h2>
              <p className="text-[11px] sm:text-xs text-emerald-200">
                Pilih metode pembayaran digital atau tunai kasir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to pay banner */}
        <div className="bg-emerald-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-emerald-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Total Tagihan Pesanan:</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-900">
              {formatRupiah(total)}
            </div>
          </div>
          {discountAmount > 0 && (
            <div className="text-right">
              <span className="text-[10px] sm:text-[11px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                Hemat {formatRupiah(discountAmount)}
              </span>
              <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                Subtotal: {formatRupiah(subtotal)}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {/* Method selector tabs */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <button
              onClick={() => setActiveMethod('qris')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                activeMethod === 'qris'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  activeMethod === 'qris'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">QRIS Dinamis</span>
              <span className="text-[10px] text-emerald-700 font-semibold">UNUGHA Pay</span>
            </button>

            <button
              onClick={() => setActiveMethod('cash')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                activeMethod === 'cash'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  activeMethod === 'cash'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Uang Tunai (Cash)</span>
              <span className="text-[10px] text-slate-400">Kalkulator Kembalian</span>
            </button>

            <button
              onClick={() => setActiveMethod('ewallet')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                activeMethod === 'ewallet'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  activeMethod === 'ewallet'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">E-Wallet / VA</span>
              <span className="text-[10px] text-slate-400">GoPay / OVO / DANA</span>
            </button>
          </div>

          {/* TAB 1: QRIS */}
          {activeMethod === 'qris' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
                {/* Visual QRIS Canvas */}
                <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-slate-300 flex flex-col items-center">
                  <div className="text-[10px] font-black text-rose-600 tracking-wider mb-2 flex items-center gap-1 font-mono">
                    <span className="bg-rose-600 text-white px-1 rounded">QRIS</span>
                    <span>STANDAR PEMBAYARAN NASIONAL</span>
                  </div>
                  
                  {/* Generated QR Pattern */}
                  <div className="relative w-44 h-44 bg-slate-900 rounded-lg p-2.5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-white fill-current"
                    >
                      {/* Corner 1 */}
                      <rect x="0" y="0" width="28" height="28" fill="white" />
                      <rect x="4" y="4" width="20" height="20" fill="black" />
                      <rect x="8" y="8" width="12" height="12" fill="white" />
                      {/* Corner 2 */}
                      <rect x="72" y="0" width="28" height="28" fill="white" />
                      <rect x="76" y="4" width="20" height="20" fill="black" />
                      <rect x="80" y="8" width="12" height="12" fill="white" />
                      {/* Corner 3 */}
                      <rect x="0" y="72" width="28" height="28" fill="white" />
                      <rect x="4" y="76" width="20" height="20" fill="black" />
                      <rect x="8" y="80" width="12" height="12" fill="white" />
                      {/* Random aesthetic QR modules */}
                      <rect x="36" y="8" width="8" height="8" fill="white" />
                      <rect x="48" y="4" width="8" height="8" fill="white" />
                      <rect x="36" y="20" width="16" height="8" fill="white" />
                      <rect x="8" y="36" width="12" height="8" fill="white" />
                      <rect x="24" y="40" width="8" height="16" fill="white" />
                      <rect x="36" y="36" width="28" height="28" fill="black" />
                      <rect x="40" y="40" width="20" height="20" fill="white" />
                      <rect x="72" y="36" width="16" height="8" fill="white" />
                      <rect x="72" y="52" width="20" height="12" fill="white" />
                      <rect x="36" y="72" width="12" height="12" fill="white" />
                      <rect x="52" y="76" width="16" height="8" fill="white" />
                      <rect x="72" y="72" width="8" height="8" fill="white" />
                      <rect x="84" y="80" width="8" height="12" fill="white" />
                    </svg>

                    {/* UNUGHA Center Badge on QR */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-emerald-900 text-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-amber-300 shadow">
                        UNUGHA
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono mt-2">
                    NMID: ID1020261005UNUGHA
                  </p>
                </div>

                {/* QR Instructions & Countdown */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Scan dengan Aplikasi Pembayaran Apapun
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      BSI Mobile, GoPay, OVO, ShopeePay, DANA, BCA, atau Livin' by Mandiri.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>
                      QR Berlaku selama:{' '}
                      <strong className="font-mono">
                        {Math.floor(qrisCountdown / 60)}:
                        {String(qrisCountdown % 60).padStart(2, '0')}
                      </strong>
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verifikasi otomatis real-time ke akun Kasir UNUGHA</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Biaya admin 0% untuk civitas akademika UNUGHA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CASH */}
          {activeMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nominal Uang Diterima dari Pelanggan (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={customCashInput}
                    onChange={handleCustomCashChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 font-mono text-xl font-bold text-slate-900"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <span className="text-[11px] text-slate-500 font-semibold mb-2 block">
                  Pilihan Cepat Uang Tunai:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickCashOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleCashOptionClick(opt.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                        cashGiven === opt.value
                          ? 'bg-emerald-700 text-white shadow'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kembalian Calculation Box */}
              <div
                className={`p-4 rounded-2xl border ${
                  isCashInsufficient
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">
                    {isCashInsufficient ? 'Uang Masih Kurang:' : 'Uang Kembalian:'}
                  </span>
                  <span
                    className={`text-xl font-black font-mono ${
                      isCashInsufficient ? 'text-rose-600' : 'text-emerald-800'
                    }`}
                  >
                    {isCashInsufficient
                      ? formatRupiah(total - cashGiven)
                      : formatRupiah(kembalian)}
                  </span>
                </div>
                {isCashInsufficient && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    Masukkan jumlah uang yang sama atau lebih besar dari total tagihan.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EWALLET / VA */}
          {activeMethod === 'ewallet' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Pilih provider e-wallet atau Virtual Account BSI UNUGHA:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'BSI Virtual Account', desc: 'No. VA: 9882 1029 4820', color: 'bg-teal-50 border-teal-200 text-teal-800' },
                  { name: 'GoPay Kampus', desc: 'Auto settlement via Gopay POS', color: 'bg-sky-50 border-sky-200 text-sky-800' },
                  { name: 'OVO Merchant', desc: 'Scan barcode di EDC kasir', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                  { name: 'ShopeePay & DANA', desc: 'Push notif nomor HP pelanggan', color: 'bg-orange-50 border-orange-200 text-orange-800' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border cursor-pointer hover:shadow-sm transition ${item.color}`}
                  >
                    <p className="text-xs font-bold">{item.name}</p>
                    <p className="text-[10px] opacity-80 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
          >
            Batal
          </button>

          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing || isCashInsufficient}
            className={`flex-1 py-3 px-6 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition ${
              isProcessing || isCashInsufficient
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <span>Memproses Transaksi...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                <span>
                  {activeMethod === 'qris'
                    ? 'Konfirmasi QRIS Diterima'
                    : activeMethod === 'cash'
                    ? 'Selesaikan Pembayaran Tunai'
                    : 'Konfirmasi Pembayaran Digital'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
