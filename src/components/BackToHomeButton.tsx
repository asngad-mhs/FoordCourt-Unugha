import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ArrowLeft } from 'lucide-react';

interface BackToHomeButtonProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'light' | 'outline' | 'amber';
  showLabel?: boolean;
  label?: string;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({
  className = '',
  variant = 'pill',
  showLabel = true,
  label = 'Beranda',
}) => {
  const { setActiveTab } = useApp();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('beranda');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition shadow-2xs group active:scale-95 ${className}`}
        title="Kembali ke Beranda Utama"
        aria-label="Kembali ke Beranda Utama"
      >
        <Home className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  if (variant === 'light') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition shadow-xs group active:scale-95 ${className}`}
        title="Kembali ke Beranda Utama"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <Home className="w-3.5 h-3.5 text-amber-300" />
        {showLabel && <span className="hidden sm:inline">{label}</span>}
      </button>
    );
  }

  if (variant === 'amber') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-black shadow-sm transition group active:scale-95 ${className}`}
        title="Kembali ke Beranda Utama"
      >
        <Home className="w-3.5 h-3.5" />
        {showLabel && <span>{label}</span>}
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 hover:border-emerald-500 transition shadow-2xs group active:scale-95 ${className}`}
        title="Kembali ke Beranda Utama"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:-translate-x-0.5 transition" />
        <Home className="w-3.5 h-3.5 text-emerald-700" />
        {showLabel && <span className="hidden sm:inline">{label}</span>}
      </button>
    );
  }

  // Default 'pill' variant
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition shadow-2xs group active:scale-95 shrink-0 ${className}`}
      title="Kembali ke Halaman Beranda Utama"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:-translate-x-0.5 transition" />
      <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
        <Home className="w-3 h-3 text-emerald-700" />
      </div>
      {showLabel && (
        <span className="hidden sm:inline">Kembali ke Beranda</span>
      )}
      {showLabel && (
        <span className="sm:hidden">Beranda</span>
      )}
    </button>
  );
};
