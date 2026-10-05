/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { KasirView } from './components/KasirView';
import { LaporanView } from './components/LaporanView';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagementView } from './components/UserManagementView';
import { SettingsView } from './components/SettingsView';
import { TenantKitchenView } from './components/TenantKitchenView';
import { LaravelStructureModal } from './components/LaravelStructureModal';
import { BerandaView } from './components/BerandaView';
import { Receipt, BarChart3, Store, ChefHat, Code2, Users, Settings, Home } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, cart, currentUser } = useApp();

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-emerald-950">
      {/* Top Navbar with Beranda, clock, account & mobile drawer */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
        {activeTab === 'beranda' && <BerandaView />}
        {activeTab === 'pos' && <KasirView />}
        {activeTab === 'laporan' && <LaporanView />}
        {(activeTab === 'admin_menu' || activeTab === 'admin_tenant') && <AdminDashboard />}
        {activeTab === 'admin_users' && <UserManagementView />}
        {activeTab === 'admin_settings' && <SettingsView />}
        {activeTab === 'tenant_kitchen' && <TenantKitchenView />}
        {activeTab === 'laravel_code' && <LaravelStructureModal />}
      </main>

      {/* Mobile Bottom Navigation Bar (Optimized for iPhone, Android, and Tablets - Hidden on Desktop lg+) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-1.5 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
            activeTab === 'beranda' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Beranda Utama"
        >
          <div className={`p-1 rounded-lg ${activeTab === 'beranda' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
            activeTab === 'pos' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Kasir POS"
        >
          <div className="relative">
            <div className={`p-1 rounded-lg ${activeTab === 'pos' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
              <Receipt className="w-4 h-4" />
            </div>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Kasir POS</span>
        </button>

        <button
          onClick={() => setActiveTab('laporan')}
          className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
            activeTab === 'laporan' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Laporan Penjualan"
        >
          <div className={`p-1 rounded-lg ${activeTab === 'laporan' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Laporan</span>
        </button>

        <button
          onClick={() => setActiveTab('admin_menu')}
          className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
            activeTab === 'admin_menu' || activeTab === 'admin_tenant'
              ? 'text-emerald-800 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Kios & Menu"
        >
          <div className={`p-1 rounded-lg ${activeTab === 'admin_menu' || activeTab === 'admin_tenant' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <Store className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Kios/Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('tenant_kitchen')}
          className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
            activeTab === 'tenant_kitchen' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Dapur KDS"
        >
          <div className={`p-1 rounded-lg ${activeTab === 'tenant_kitchen' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <ChefHat className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Dapur</span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin_users')}
            className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
              activeTab === 'admin_users' ? 'text-purple-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Kelola Kasir"
          >
            <div className={`p-1 rounded-lg ${activeTab === 'admin_users' ? 'bg-purple-100 text-purple-700' : ''}`}>
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Kasir</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('laravel_code')}
            className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition active:scale-95 ${
              activeTab === 'laravel_code' ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Struktur Laravel"
          >
            <div className={`p-1 rounded-lg ${activeTab === 'laravel_code' ? 'bg-rose-100 text-rose-600' : ''}`}>
              <Code2 className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Laravel</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
