import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateInvoiceNumber } from '../utils/formatters';
import { BackToHomeButton } from './BackToHomeButton';
import {
  Settings,
  Store,
  FileText,
  Save,
  CheckCircle2,
  RefreshCw,
  Hash,
  MapPin,
  Phone,
  Image as ImageIcon,
  Printer,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [form, setForm] = useState(settings);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const previewInvoice = generateInvoiceNumber(
    1,
    form.receiptPrefix || 'TRX',
    form.receiptSeparator || '-',
    form.receiptDigits || 3
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <BackToHomeButton />
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-700" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Pengaturan Sistem & Struk Kasir
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Konfigurasi identitas foodcourt, alamat, footer, dan format nomor struk transaksi (FR-1, FR-2)
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Bagian 1: Identitas FoodCourt (FR-1) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <Store className="w-4 h-4" />
                <span>FR-1: Identitas FoodCourt & Informasi Struk</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama FoodCourt
                </label>
                <input
                  type="text"
                  value={form.foodcourtName}
                  onChange={(e) => setForm({ ...form, foodcourtName: e.target.value })}
                  placeholder="FoodCourt UNUGHA"
                  className="w-full p-2.5 border rounded-xl font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Kampus / Lembaga Induk
                </label>
                <input
                  type="text"
                  value={form.campusName}
                  onChange={(e) => setForm({ ...form, campusName: e.target.value })}
                  placeholder="Universitas Nahdlatul Ulama Al Ghazali Cilacap"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Alamat Lengkap (Dicetak pada Struk)
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  placeholder="Jl. Oya No. 9, Kroya, Cilacap, Jawa Tengah 53282"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    No. Telepon / WhatsApp Kasir
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Logo Image URL (Opsional)
                  </label>
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="https://... (logo gambar)"
                    className="w-full p-2.5 border rounded-xl text-slate-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Catatan Kaki Struk (Receipt Footer Message)
                </label>
                <input
                  type="text"
                  value={form.receiptFooter}
                  onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
                  placeholder="Simpan struk ini untuk pengambilan makanan di stand..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            {/* Bagian 2: Format Nomor Struk (FR-2) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <Hash className="w-4 h-4" />
                <span>FR-2: Format Nomor Transaksi & Struk</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Prefix Nomor
                  </label>
                  <input
                    type="text"
                    value={form.receiptPrefix}
                    onChange={(e) =>
                      setForm({ ...form, receiptPrefix: e.target.value.toUpperCase() })
                    }
                    placeholder="TRX"
                    className="w-full p-2.5 border rounded-xl font-mono uppercase font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Contoh: TRX, INV, FCT
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Karakter Pemisah
                  </label>
                  <select
                    value={form.receiptSeparator}
                    onChange={(e) => setForm({ ...form, receiptSeparator: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  >
                    <option value="-">Strip ( - )</option>
                    <option value="/">Garis Miring ( / )</option>
                    <option value=".">Titik ( . )</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Pemisah tanggal & urutan
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Digit Penomoran
                  </label>
                  <select
                    value={form.receiptDigits}
                    onChange={(e) =>
                      setForm({ ...form, receiptDigits: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  >
                    <option value={3}>3 Digit (001)</option>
                    <option value={4}>4 Digit (0001)</option>
                    <option value={5}>5 Digit (00001)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Panjang angka urutan
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Pratinjau Format Nomor Struk:
                  </span>
                  <span className="font-mono text-base font-black text-emerald-900">
                    {previewInvoice}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Aktif Real-Time
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Simpan Perubahan Pengaturan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Struk Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-emerald-700" />
              Pratinjau Live Struk Kasir Thermal
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
              80mm Thermal
            </span>
          </div>

          {/* Struk Simulation Paper */}
          <div className="w-full max-w-[320px] bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 font-mono text-[10px] text-slate-800 space-y-2.5 leading-tight shadow-inner">
            {/* Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-300">
              {form.logoUrl && (
                <div className="flex justify-center mb-1">
                  <img
                    src={form.logoUrl}
                    alt="Logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
              <div className="font-sans font-black text-xs text-slate-900 uppercase">
                {form.foodcourtName || 'FOODCOURT UNUGHA'}
              </div>
              <p className="text-[9px] text-slate-500 font-sans">
                {form.campusName}
              </p>
              <p className="text-[8px] text-slate-400 font-sans">
                {form.address}
              </p>
              <p className="text-[8px] text-slate-400 font-sans">
                Telp/WA: {form.phone}
              </p>
            </div>

            {/* Meta */}
            <div className="space-y-0.5 text-[9px] text-slate-600 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>No. Struk</span>
                <span className="font-bold text-slate-900">{previewInvoice}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu</span>
                <span>05/10/2026, 12:30</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir</span>
                <span>Siti Aminah</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan</span>
                <span className="font-bold">Ahmad (Dine In - Meja 02)</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1.5 py-1 text-[9px]">
              <div>
                <div className="flex justify-between">
                  <span className="font-bold">Ayam Geprek Bawang</span>
                  <span>Rp 15.000</span>
                </div>
                <div className="text-slate-400 text-[8px]">1 x Rp 15.000 (Ayam Geprek)</div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="font-bold">Es Kopi Susu Aren</span>
                  <span>Rp 12.000</span>
                </div>
                <div className="text-slate-400 text-[8px]">1 x Rp 12.000 (Kopi Santri)</div>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1.5 border-t border-dashed border-slate-300 text-[9px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 27.000</span>
              </div>
              <div className="flex justify-between font-bold text-[10px] text-slate-900 pt-0.5 border-t border-slate-200">
                <span>TOTAL AKHIR</span>
                <span className="text-emerald-800">Rp 27.000</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar (QRIS)</span>
                <span>Rp 27.000</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali</span>
                <span>Rp 0</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[8px] text-slate-500 font-sans italic">
              {form.receiptFooter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
