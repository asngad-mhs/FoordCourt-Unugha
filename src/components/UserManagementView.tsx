import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/formatters';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { BackToHomeButton } from './BackToHomeButton';

export const UserManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, currentUser } = useApp();

  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state for add
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role: 'kasir' as UserRole,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) return;

    addUser(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      role: 'kasir',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <BackToHomeButton />
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-700" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Manajemen Pengguna & Kasir (FR-03)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Admin dapat menambah, mengedit data kasir, mereset password, dan mengatur status aktif akun
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>Tambah Kasir / Admin Baru</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Pengguna Terdaftar
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {users.length} Akun
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Petugas Kasir Aktif
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            {users.filter((u) => u.role === 'kasir' && u.isActive).length} Kasir
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Administrator
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1 font-mono">
            {users.filter((u) => u.role === 'admin').length} Pengelola
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kasir, username, atau email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
        >
          <option value="all">Semua Role</option>
          <option value="kasir">Hanya Kasir</option>
          <option value="admin">Hanya Admin</option>
          <option value="tenant">Hanya Tenant</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama & Profil</th>
                <th className="px-4 py-3.5">Username</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5 text-center">Hak Akses (Role)</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isSelf = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isSelf && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-slate-700">
                      @{user.username}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">
                      {user.email}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : user.role === 'kasir'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                        {user.role === 'kasir' && <UserCheck className="w-3 h-3" />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={isSelf}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        } ${isSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                        title="Klik untuk ubah status aktif"
                      >
                        {user.isActive ? '● Aktif' : '○ Nonaktif'}
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus akun ${user.name}?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          disabled={isSelf}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-20"
                          title="Hapus User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Kasir / User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                Tambah Petugas Kasir Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rina Safitri, S.Kom"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Username Login</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Contoh: kasir3"
                    className="w-full p-2.5 border rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contoh: kasir123"
                    className="w-full p-2.5 border rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kasir3@foodcourt.unugha.ac.id"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role / Hak Akses</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRole })
                    }
                    className="w-full p-2.5 border rounded-xl font-medium"
                  >
                    <option value="kasir">Kasir POS</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status Akun</label>
                  <select
                    value={formData.isActive ? '1' : '0'}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.value === '1' })
                    }
                    className="w-full p-2.5 border rounded-xl font-medium"
                  >
                    <option value="1">Aktif Langsung</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Kasir */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Edit Data Kasir / Pengguna
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Username Login</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, username: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Password Baru</label>
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, password: e.target.value })
                    }
                    placeholder="Kosongkan jika tak diubah"
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role / Hak Akses</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                    }
                    className="w-full p-2.5 border rounded-xl font-medium"
                  >
                    <option value="kasir">Kasir POS</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status Akun</label>
                  <select
                    value={editingUser.isActive ? '1' : '0'}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, isActive: e.target.value === '1' })
                    }
                    className="w-full p-2.5 border rounded-xl font-medium"
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Perbarui Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
