# 🛒 Kasir FoodCourt UNUGHA (POS & Keuangan Multi-Tenant)

Sistem Kasir Point of Sale (POS) dan Pengelolaan Keuangan Multi-Tenant berbasis web untuk **FoodCourt Universitas Nahdlatul Ulama Al Ghazali (UNUGHA) Cilacap**. Aplikasi ini dilengkapi dengan pencatatan pesanan kasir instan, pembayaran digital QRIS Dinamis & Tunai, cetak struk thermal, laporan harian real-time, Kitchen Display System (KDS), serta panduan struktur arsitektur backend Laravel 11 (`kasir-unugha/`).

---

## 🌟 Fitur & Kebutuhan Fungsional

### 1. 🔐 Autentikasi & Manajemen Pengguna
* **FR-01**: Halaman Login Gatekeeper pertama dengan verifikasi username & password serta toggle intip password.
* **FR-02**: Multi-Role pengguna: **Admin FoodCourt**, **Kasir Utama**, dan **Staff Tenant Dapur (KDS)**.
* **FR-03**: Manajemen Pengguna oleh Admin: Tambah, edit data kasir, reset password, dan aktivasi/deaktivasi akun kasir.

### 2. 🏪 Manajemen Kios Mitra Tenant
* **FR-1**: CRUD Kios Tenant (Nama Stand, No. Kios, Penanggung Jawab, No. Telepon/WA, Persentase Bagi Hasil/Setoran, Status Aktif).
* **FR-2**: Setiap item menu makanan & minuman terhubung langsung ke pemilik stand kios tenant.

### 3. 🍲 Manajemen Menu & Stok
* **FR-1**: CRUD Master Menu (Nama Menu, Harga Jual, Kategori, Stand Tenant, Foto Makanan, Deskripsi).
* **FR-2**: Klasifikasi Kategori: *Makanan Berat*, *Aneka Mie & Bakso*, *Minuman Segar*, *Cemilan & Snack*, dan *Paket Santri Hemat*.
* **FR-3**: Manajemen status ketersediaan menu (*Tersedia* / *Habis*) dan update jumlah stok harian secara real-time.

### 4. 💳 Transaksi Kasir POS Cepat
* **FR-1**: Pilih menu makanan/minuman langsung masuk ke keranjang belanja kasir.
* **FR-2**: Pengaturan jumlah (*qty*), catatan khusus per item (misal: level pedas, es dipisah), dan tombol hapus item.
* **FR-3**: Perhitungan subtotal, diskon otomatis (*Mahasiswa 10%*, *Dosen/Karyawan 15%*, *Diskon Khusus*), dan total tagihan instan.
* **FR-4**: Fitur hitung uang bayar tunai & kalkulasi uang kembalian secara otomatis dengan tombol pecahan uang cepat (Rp 10rb, 20rb, 50rb, 100rb, Uang Pas).
* **FR-5**: Penomoran transaksi unik otomatis (Contoh: `TRX-20261005-001` atau format kustom `INV/2026/001`).
* **FR-6**: Cetak struk kasir format thermal (58mm / 80mm) yang memuat logo, nama foodcourt, alamat kampus, kasir, rincian menu, total bayar, uang diterima, kembalian, dan barcode.
* **FR-7**: Opsi pembatalan transaksi & reset keranjang belanja sebelum pembayaran disimpan.
* **Pembayaran Digital**: QRIS Dinamis UNUGHA Pay dengan generate QR matrix & simulasi scan bayar instan, Transfer VA Bank, dan E-Wallet (GoPay, OVO, ShopeePay, DANA).

### 5. 📊 Laporan Penjualan Real-Time
* **FR-1**: Dashboard metrik harian: Total Omset Pendapatan, Total Transaksi Selesai, dan Jumlah Item Terjual.
* **FR-2**: Filter laporan fleksibel berdasarkan rentang tanggal (Hari Ini / Kustom) dan filter per Kios Tenant mitra.
* **FR-3**: Export data laporan penjualan ke file spreadsheet **CSV / Excel** siap pakai.
* **FR-4**: Rekapitulasi per Tenant untuk perhitungan setoran komisi ke pengelola FoodCourt UNUGHA.

### 6. ⚙️ Pengaturan FoodCourt & Struk
* **FR-1**: Konfigurasi identitas foodcourt, nama kampus UNUGHA, alamat lengkap, nomor kontak, logo, dan pesan footer struk.
* **FR-2**: Format kustomisasi penomoran struk (Prefix transaksi, karakter pemisah, dan jumlah digit urutan).

### 7. 👨‍🍳 Kitchen Display System (KDS)
* Monitor antrian dapur pesanan secara real-time per stand tenant dengan 4 tahap status: **Diterima**, **Dimasak**, **Siap Disajikan**, dan **Selesai**.

---

## 🏛️ Struktur Arsitektur Backend Laravel 11 (`kasir-unugha/`)

Aplikasi ini menyertakan dokumentasi dan template kode lengkap untuk implementasi ke backend Laravel:

```
kasir-unugha/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php          # Login, logout, role check
│   │   │   ├── MenuController.php          # CRUD menu & stok
│   │   │   ├── TenantController.php        # CRUD mitra kios tenant
│   │   │   ├── TransactionController.php   # POS checkout, QRIS, cetak struk
│   │   │   └── ReportController.php        # Laporan omset & export CSV
│   │   └── Middleware/
│   │       └── RoleMiddleware.php          # Proteksi hak akses role admin/kasir
│   └── Models/
│       ├── User.php                        # Model akun pengguna & role
│       ├── Tenant.php                      # Model kios mitra & komisi
│       ├── Menu.php                        # Model menu makanan/minuman
│       ├── Category.php                    # Model kategori menu
│       ├── Transaction.php                 # Model transaksi penjualan & struk
│       └── TransactionItem.php             # Model rincian item per transaksi
├── database/
│   └── migrations/
│       └── 2026_10_01_create_foodcourt_tables.php # Skema relasi tabel database
├── resources/
│   └── views/
│       ├── auth/
│       │   └── login.blade.php             # Tampilan halaman login
│       ├── kasir/
│       │   └── index.blade.php             # Tampilan kasir POS & keranjang
│       ├── admin/
│       │   └── dashboard.blade.php         # Tampilan admin & master menu
│       └── laporan/
│           └── index.blade.php             # Tampilan laporan & grafik penjualan
└── routes/
    └── web.php                             # Definisi route & middleware
```

---

## 🔑 Akun Demo Cepat (1-Klik Login)

| Role | Nama Pengguna | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Administrator Utama | `admin` | `admin123` | Akses penuh manajemen kios, menu, kasir, & pengaturan |
| **Kasir 1** | Siti Aminah | `kasir1` | `kasir123` | POS Kasir, QRIS Dinamis, cetak struk, laporan harian |
| **Kasir 2** | Ahmad Fauzi | `kasir2` | `kasir123` | POS Kasir shift sore, transaksi tunai & digital |
| **Tenant KDS** | Kantin Barokah | `barokah` | `tenant123` | Layar antrian dapur Kitchen Display System |

---

## 📱 Kompatibilitas Ukuran Layar

Aplikasi ini dirancang menggunakan arsitektur antarmuka responsif (*mobile-first & desktop-optimized*):
* 💻 **PC Desktop & Laptop** (Layar lebar, mode split-screen POS & keranjang permanen).
* 📱 **Tablet & iPad** (Navigasi adaptif, layout menu grid 2-3 kolom).
* 📱 **Smartphone (iPhone / Android)** (Floating cart checkout, drawer navigasi terintegrasi, tombol navigasi bawah aman dari safe-area).
* 🏠 **Ikon Beranda**: Tersedia tombol kembali ke **Beranda** di seluruh modul menu, katalog, keranjang, laporan, dan jendela struk.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Iconography**: [Lucide React](https://lucide.dev/)
* **Animation & Audio Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) & Web Audio API Synthesizer
* **Persistence**: LocalStorage Browser State Sync

---

## 🚀 Panduan Menjalankan Proyek

### 1. Prasyarat
* Node.js versi 18+ atau yang lebih baru
* npm / bun / yarn / pnpm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi di browser pada alamat: `http://localhost:3000` atau URL port Vite yang aktif.

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 🏫 Identitas Lembaga
* **Institusi**: Universitas Nahdlatul Ulama Al Ghazali (UNUGHA) Cilacap
* **Unit**: Pengelola FoodCourt & Koperasi Kampus UNUGHA
* **Lokasi**: Jl. Oya No. 9, Kroya, Kabupaten Cilacap, Jawa Tengah
