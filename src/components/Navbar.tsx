import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LoginModal } from './LoginModal';
import {
  Store,
  Receipt,
  BarChart3,
  ChefHat,
  Code2,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  User as UserIcon,
  ChevronDown,
  LogIn,
  LogOut,
  Home,
  Menu as MenuIcon,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    cart,
    soundEnabled,
    setSoundEnabled,
    resetAllData,
    settings,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalCartItems = cart.reduce((acc, it) => acc + it.quantity, 0);

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Campus Identity (Clicking navigates to Beranda) */}
            <div
              onClick={() => setActiveTab('beranda')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
              title="Menuju Beranda Utama FoodCourt UNUGHA"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                  <Store className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase group-hover:text-amber-300 transition-colors">
                    {settings.foodcourtName || 'FOODCOURT UNUGHA'}
                  </span>
                  <span className="bg-emerald-800/80 text-emerald-200 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-700">
                    POS
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-200/80 font-medium truncate max-w-[170px] sm:max-w-xs">
                  {settings.campusName || 'Univ. Nahdlatul Ulama Al Ghazali Cilacap'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Clean & Focused POS Operations) */}
            <nav className="hidden lg:flex items-center gap-1 bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-800/50">
              <button
                onClick={() => setActiveTab('beranda')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'beranda'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
                title="Halaman Beranda Utama"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'pos'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Kasir POS</span>
                {totalCartItems > 0 && (
                  <span className="ml-1 bg-emerald-900 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('laporan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'laporan'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Laporan Harian</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </button>

              <button
                onClick={() => setActiveTab('tenant_kitchen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'tenant_kitchen'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Dapur KDS</span>
              </button>

              <button
                onClick={() => setActiveTab('laravel_code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'laravel_code'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm font-bold'
                    : 'text-emerald-200 hover:bg-emerald-800/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Laravel Code</span>
              </button>
            </nav>

            {/* Right Controls: Clock, Sound, User Switcher & Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Live Clock (Laptop/PC) */}
              <div className="hidden xl:flex flex-col items-end text-right pr-2 border-r border-emerald-800/60">
                <span className="text-xs font-bold tracking-wider font-mono text-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-300" />
                  {currentTime}
                </span>
                <span className="text-[10px] text-emerald-200/80">{currentDate}</span>
              </div>

              {/* Sound Mute/Unmute */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Matikan Suara Audio' : 'Nyalakan Suara Audio'}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-800/40 transition active:scale-95"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Reset Data Button */}
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Reset semua data transaksi, stok menu, dan keranjang kembali ke default awal UNUGHA?'
                    )
                  ) {
                    resetAllData();
                  }
                }}
                title="Reset Data Demo"
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-rose-900/40 text-emerald-200 hover:text-rose-200 border border-emerald-800/40 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* User Account Menu - Icon Only */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="p-1.5 sm:p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition active:scale-95 flex items-center gap-1.5 group"
                    title={`Akun: ${currentUser.name} (@${currentUser.username}) - Klik untuk menu akun`}
                    aria-label="Menu Akun Pengguna"
                  >
                    <div className="relative flex items-center justify-center">
                      <img
                        src={
                          currentUser.avatar ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
                        }
                        alt={currentUser.name}
                        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg object-cover border border-amber-400/60 group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-950 rounded-full"></span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-emerald-300 group-hover:translate-y-0.5 transition-transform hidden sm:block" />
                  </button>

                  {showRoleDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setShowRoleDropdown(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Akun Terhubung:
                        </p>
                        <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                        <p className="text-[10px] text-emerald-700 font-mono">
                          @{currentUser.username}
                        </p>
                      </div>

                      <div className="p-1 space-y-1">
                        <button
                          onClick={() => {
                            setShowRoleDropdown(false);
                            setActiveTab('beranda');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Home className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Halaman Beranda Utama</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowRoleDropdown(false);
                            setIsLoginModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Ganti Akun / Login User Lain (FR-01)</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowRoleDropdown(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout Keluar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold shadow transition active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Login (FR-01)</span>
                  <span className="sm:hidden">Login</span>
                </button>
              )}

              {/* Hamburger Button for Mobile & Tablet (Phones, iPad, Tablets) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 transition active:scale-95"
                title="Buka Menu Navigasi"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-amber-300" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Full Navigation Drawer (Responsive across phones, tablets, iPad) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-start pt-16">
          <div
            className="bg-emerald-950 border-b border-emerald-800 p-4 sm:p-6 shadow-2xl text-white max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-none animate-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80 mb-3">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">Menu FoodCourt UNUGHA</h3>
                  <p className="text-[10px] text-emerald-300">Pilih modul aplikasi untuk membukanya</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-emerald-900 text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => navigateTo('beranda')}
                className={`flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                  activeTab === 'beranda'
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                    : 'bg-emerald-900/70 hover:bg-emerald-800 text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'beranda' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-800 text-white'}`}>
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">🏠 Beranda Utama</p>
                  <p className="text-[10px] opacity-80">Dashboard ringkasan & jalan pintas</p>
                </div>
              </button>

              <button
                onClick={() => navigateTo('pos')}
                className={`flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                  activeTab === 'pos'
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                    : 'bg-emerald-900/70 hover:bg-emerald-800 text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'pos' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-800 text-white'}`}>
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">💳 Kasir POS</p>
                    {totalCartItems > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {totalCartItems}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] opacity-80">Pesanan, QRIS Dinamis & Struk</p>
                </div>
              </button>

              <button
                onClick={() => navigateTo('laporan')}
                className={`flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                  activeTab === 'laporan'
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                    : 'bg-emerald-900/70 hover:bg-emerald-800 text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'laporan' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-800 text-white'}`}>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">📊 Laporan Penjualan</p>
                  <p className="text-[10px] opacity-80">Real-time omset, filter & CSV</p>
                </div>
              </button>

              <button
                onClick={() => navigateTo('tenant_kitchen')}
                className={`flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                  activeTab === 'tenant_kitchen'
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                    : 'bg-emerald-900/70 hover:bg-emerald-800 text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'tenant_kitchen' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-800 text-white'}`}>
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">👨‍🍳 Kitchen Display (KDS)</p>
                  <p className="text-[10px] opacity-80">Antrian masak tiap stand dapur</p>
                </div>
              </button>

              <button
                onClick={() => navigateTo('laravel_code')}
                className={`flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                  activeTab === 'laravel_code'
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                    : 'bg-emerald-900/70 hover:bg-emerald-800 text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'laravel_code' ? 'bg-emerald-950 text-amber-400' : 'bg-emerald-800 text-white'}`}>
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">📄 Struktur Laravel 11</p>
                  <p className="text-[10px] opacity-80">Source code Controllers & Views</p>
                </div>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300">
              <span className="font-mono text-[11px]">{currentTime}</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="font-bold text-amber-300 underline"
              >
                Ganti Akun / Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
