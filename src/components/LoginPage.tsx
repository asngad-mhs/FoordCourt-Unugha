import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Lock,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Clock,
  KeyRound,
  ChefHat,
  Receipt,
  HelpCircle,
  Check,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, settings } = useApp();

  const [username, setUsername] = useState<string>('kasir1');
  const [password, setPassword] = useState<string>('kasir123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan isi username dan password Anda.');
      return;
    }

    const res = login(username.trim(), password);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(res.message || 'Username atau password salah. Cek akun demo di bawah.');
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
    const res = login(u, p);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(res.message || 'Gagal login.');
    }
  };

  const demoAccounts = [
    {
      role: 'admin',
      label: 'Admin FoodCourt (FR-02)',
      name: 'Administrator Utama',
      username: 'admin',
      password: 'admin123',
      desc: 'Akses penuh: Kelola Kios, Menu, Petugas Kasir & Pengaturan Struk',
      icon: ShieldCheck,
      color: 'bg-purple-600 text-white',
      badge: 'Full Access',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      role: 'kasir',
      label: 'Kasir 1 (FR-02)',
      name: 'Siti Aminah',
      username: 'kasir1',
      password: 'kasir123',
      desc: 'Pencatatan pesanan POS, pembayaran QRIS & Tunai, cetak struk',
      icon: Receipt,
      color: 'bg-emerald-600 text-white',
      badge: 'Kasir Utama',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      role: 'kasir',
      label: 'Kasir 2 (FR-02)',
      name: 'Ahmad Fauzi',
      username: 'kasir2',
      password: 'kasir123',
      desc: 'Shift kasir sore, pencatatan pesanan & laporan harian',
      icon: UserIcon,
      color: 'bg-teal-600 text-white',
      badge: 'Kasir Shift',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      role: 'tenant',
      label: 'Stand Tenant Dapur (KDS)',
      name: 'Kantin Barokah UNUGHA',
      username: 'barokah',
      password: 'tenant123',
      desc: 'Monitor antrian masak dapur stand mitra',
      icon: ChefHat,
      color: 'bg-amber-600 text-white',
      badge: 'Dapur KDS',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-3 sm:p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden selection:bg-amber-400 selection:text-emerald-950">
      {/* Background Ambience Gradient & Glow */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between py-2 sm:py-3 border-b border-slate-800/80 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Store className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight uppercase">
                {settings.foodcourtName || 'FOODCOURT UNUGHA'}
              </span>
              <span className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
                Sistem Kasir POS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {settings.campusName || 'Universitas Nahdlatul Ulama Al Ghazali Cilacap'}
            </p>
          </div>
        </div>

        {/* Live Clock & Date */}
        <div className="hidden sm:flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentTime}</span>
          </div>
          <span className="text-[11px] text-slate-400">{currentDate}</span>
        </div>
      </header>

      {/* Main Login Card Center Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-6 sm:my-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Side: UNUGHA POS Campus Identity & Information */}
        <div className="lg:col-span-6 space-y-5 text-white order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/80 text-amber-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gerbang Masuk Autentikasi Pengguna (FR-01 & FR-02)</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Selamat Datang di Portal Kasir{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                FoodCourt UNUGHA
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sistem point-of-sale modern terintegrasi untuk seluruh stand tenant makanan & minuman kampus. Silakan masukkan kredensial akun kasir atau administrator untuk memulai transaksi harian.
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pembayaran</span>
              <span className="text-xs font-bold text-emerald-400">QRIS Dinamis & Tunai</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Laporan</span>
              <span className="text-xs font-bold text-amber-400">Real-Time & Export CSV</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Multi-Tenant</span>
              <span className="text-xs font-bold text-teal-300">5+ Stand Mitra Aktif</span>
            </div>
          </div>

          {/* Security & Assistance Note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Belum memiliki akun kasir? Hubungi <strong>Administrator Pengelola UNUGHA</strong> atau gunakan tombol akun demo cepat untuk evaluasi sistem langsung.
            </p>
          </div>
        </div>

        {/* Right Side: Login Box Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 order-1 lg:order-2 animate-in fade-in zoom-in-95 duration-200">
          {/* Form Header */}
          <div className="pb-5 border-b border-slate-100 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Masuk Aplikasi Kasir</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  FR-01: Masukkan Username & Password terdaftar
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <KeyRound className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 animate-bounce" />
              <div>
                <div className="font-black text-sm">Autentikasi Berhasil!</div>
                <div className="text-[11px] text-emerald-700">Membuka dashboard FoodCourt UNUGHA...</div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                Username / ID Kasir
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage('');
                  }}
                  required
                  placeholder="Contoh: kasir1 atau admin"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-slate-800 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">Default: kasir123 / admin123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  required
                  placeholder="Masukkan password Anda..."
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-slate-800 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-500" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className={`w-full py-3 sm:py-3.5 px-4 rounded-xl text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98] ${
                isSuccess
                  ? 'bg-emerald-700 cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Aplikasi</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </form>

          {/* FR-02: Quick 1-Click Role Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 text-center">
              Atau Pilih Akun Demo Cepat 1-Klik (FR-02 Role):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {demoAccounts.map((acc) => {
                const isCurrentForm = username === acc.username;
                const IconComp = acc.icon;
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleQuickLogin(acc.username, acc.password)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 group active:scale-95 ${
                      isCurrentForm
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-2xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${acc.color} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] truncate">{acc.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${acc.badgeColor}`}>
                          {acc.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        user: <strong className="text-slate-600">{acc.username}</strong>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 py-3 text-center text-xs text-slate-500 border-t border-slate-800/80 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()} <strong>FoodCourt UNUGHA Cilacap</strong> • Sistem Kasir POS & Keuangan Multi-Tenant
        </p>
        <p className="text-[11px] text-slate-400">
          Format Laravel 11 • Terverifikasi Kampus UNUGHA
        </p>
      </footer>
    </div>
  );
};
