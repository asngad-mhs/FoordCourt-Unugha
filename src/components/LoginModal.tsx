import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  User as UserIcon,
  Store,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, users, currentUser } = useApp();

  const [username, setUsername] = useState<string>('kasir1');
  const [password, setPassword] = useState<string>('kasir123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = login(username, password);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.message || 'Gagal login.');
    }
  };

  const handleQuickSelect = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-6 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 p-2 flex items-center justify-center">
              <Store className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">FoodCourt UNUGHA</h2>
              <p className="text-xs text-emerald-200">
                Sistem Autentikasi Kasir & Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Selector */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Pilih Akun Demo Cepat (Role):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('admin', 'admin123')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  username === 'admin'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold">Admin Pengelola</div>
                  <div className="text-[10px] text-slate-400 font-mono">admin / admin123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('kasir1', 'kasir123')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  username === 'kasir1'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <UserIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold">Kasir 1 (Siti)</div>
                  <div className="text-[10px] text-slate-400 font-mono">kasir1 / kasir123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('kasir2', 'kasir123')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  username === 'kasir2'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <UserIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold">Kasir 2 (Budi)</div>
                  <div className="text-[10px] text-slate-400 font-mono">kasir2 / kasir123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('barokah', 'tenant123')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  username === 'barokah'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Store className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold">Tenant Barokah</div>
                  <div className="text-[10px] text-slate-400 font-mono">barokah / tenant123</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                Username / ID Pengguna
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Masukkan username kasir..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              {currentUser && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Tutup
                </button>
              )}

              <button
                type="submit"
                disabled={isSuccess}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>Login Berhasil!</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
