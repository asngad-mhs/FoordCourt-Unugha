export interface LaravelFileItem {
  path: string;
  name: string;
  folder: string;
  language: 'php' | 'blade' | 'sql';
  description: string;
  code: string;
}

export const LARAVEL_CODEBASE: LaravelFileItem[] = [
  // 1. AuthController.php
  {
    path: 'app/Http/Controllers/AuthController.php',
    name: 'AuthController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'Menangani otentikasi login, logout, dan pengalihan session berdasarkan role (Kasir, Admin, Tenant).',
    code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use App\\Models\\User;

class AuthController extends Controller
{
    /**
     * Menampilkan halaman login kasir/admin FoodCourt UNUGHA
     */
    public function showLoginForm()
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user()->role);
        }
        return view('auth.login');
    }

    /**
     * Memproses otentikasi pengguna
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();

            return redirect()->intended($this->getRedirectPath($user->role))
                ->with('success', 'Selamat datang di Sistem Kasir FoodCourt UNUGHA, ' . $user->name);
        }

        return back()->withErrors([
            'username' => 'Kredensial yang dimasukkan tidak cocok dengan database UNUGHA.',
        ])->onlyInput('username');
    }

    /**
     * Logout pengguna dan hancurkan session
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('info', 'Anda telah berhasil logout.');
    }

    private function getRedirectPath(string $role): string
    {
        return match ($role) {
            'admin' => route('admin.dashboard'),
            'kasir' => route('kasir.index'),
            'tenant' => route('tenant.kitchen'),
            default => route('kasir.index'),
        };
    }

    private function redirectBasedOnRole(string $role)
    {
        return redirect($this->getRedirectPath($role));
    }
}
`,
  },

  // 2. MenuController.php
  {
    path: 'app/Http/Controllers/MenuController.php',
    name: 'MenuController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'Manajemen menu makanan/minuman, kontrol stok real-time, status ketersediaan, dan filter per tenant.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Menu;
use App\\Models\\Tenant;
use App\\Models\\Category;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::with(['tenant', 'category']);

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $menus = $query->orderBy('name')->paginate(12);
        $tenants = Tenant::where('status', 'active')->get();
        $categories = Category::all();

        return view('admin.menu.index', compact('menus', 'tenants', 'categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tenant_id'   => 'required|exists:tenants,id',
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:150',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'sku'         => 'required|string|unique:menus,sku',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        $validated['is_available'] = $request->stock > 0;
        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu berhasil ditambahkan ke daftar FoodCourt UNUGHA.');
    }

    public function updateStock(Request $request, Menu $menu)
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $menu->update([
            'stock' => $request->stock,
            'is_available' => $request->stock > 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Stok menu ' . $menu->name . ' diperbarui.',
            'current_stock' => $menu->stock,
        ]);
    }
}
`,
  },

  // 3. TenantController.php
  {
    path: 'app/Http/Controllers/TenantController.php',
    name: 'TenantController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'Manajemen data tenant/stand mitra foodcourt, penentuan nomor stand, dan persentase komisi bagi hasil.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Tenant;
use Illuminate\\Http\\Request;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::withCount('menus')
            ->withSum('transactionItems', 'subtotal')
            ->get();

        return view('admin.tenants.index', compact('tenants'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'stand_number'    => 'required|string|unique:tenants,stand_number',
            'owner_name'      => 'required|string|max:100',
            'phone'           => 'required|string|max:20',
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        Tenant::create($validated);

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Stand tenant baru berhasil didaftarkan di FoodCourt UNUGHA.');
    }

    public function toggleStatus(Tenant $tenant)
    {
        $tenant->update([
            'status' => $tenant->status === 'active' ? 'closed' : 'active',
        ]);

        return redirect()->back()->with('success', 'Status operasional stand diperbarui.');
    }
}
`,
  },

  // 4. TransactionController.php
  {
    path: 'app/Http/Controllers/TransactionController.php',
    name: 'TransactionController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'Engine utama POS: pemrosesan keranjang belanja, split pesanan multi-tenant, diskon mahasiswa UNUGHA, & QRIS.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Transaction;
use App\\Models\\TransactionItem;
use App\\Models\\Menu;
use App\\Models\\Tenant;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class TransactionController extends Controller
{
    public function index()
    {
        $tenants = Tenant::where('status', 'active')->get();
        $menus = Menu::where('is_available', true)->with(['tenant', 'category'])->get();

        return view('kasir.index', compact('tenants', 'menus'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'  => 'required|string|max:100',
            'table_number'   => 'required|string|max:30',
            'order_type'     => 'required|in:dine_in,take_away',
            'payment_method' => 'required|in:qris,cash,transfer,ewallet',
            'discount_type'  => 'required|in:none,mahasiswa_10,dosen_15,custom',
            'discount_amount'=> 'numeric|min:0',
            'amount_paid'    => 'required|numeric|min:0',
            'items'          => 'required|array|min:1',
            'items.*.menu_id'=> 'required|exists:menus,id',
            'items.*.qty'    => 'required|integer|min:1',
            'items.*.note'   => 'nullable|string|max:200',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $invoiceNumber = 'INV/' . date('Ymd') . '/' . strtoupper(Str::random(5));
            $subtotal = 0;
            $itemsData = [];

            // Validasi ketersediaan dan kalkulasi subtotal
            foreach ($validated['items'] as $item) {
                $menu = Menu::with('tenant')->lockForUpdate()->findOrFail($item['menu_id']);
                
                if ($menu->stock < $item['qty']) {
                    throw new \\Exception("Stok {$menu->name} tidak mencukupi (sisa: {$menu->stock}).");
                }

                $itemSubtotal = $menu->price * $item['qty'];
                $subtotal += $itemSubtotal;

                // Kurangi stok menu
                $menu->decrement('stock', $item['qty']);
                if ($menu->stock <= 0) {
                    $menu->update(['is_available' => false]);
                }

                $itemsData[] = [
                    'menu' => $menu,
                    'qty' => $item['qty'],
                    'price' => $menu->price,
                    'subtotal' => $itemSubtotal,
                    'note' => $item['note'] ?? null,
                ];
            }

            $discount = (float)$validated['discount_amount'];
            $total = max(0, $subtotal - $discount);
            $change = max(0, $validated['amount_paid'] - $total);

            // Simpan Transaksi Master
            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'cashier_id'     => auth()->id() ?? 1,
                'customer_name'  => $validated['customer_name'],
                'table_number'   => $validated['table_number'],
                'order_type'     => $validated['order_type'],
                'subtotal'       => $subtotal,
                'discount_type'  => $validated['discount_type'],
                'discount_amount'=> $discount,
                'tax_amount'     => 0,
                'total'          => $total,
                'payment_method' => $validated['payment_method'],
                'amount_paid'    => $validated['amount_paid'],
                'change'         => $change,
                'payment_status' => 'paid',
                'kitchen_status' => 'diterima',
            ]);

            // Simpan Detail Item dan Distribusi Komisi Tenant
            foreach ($itemsData as $entry) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'menu_id'        => $entry['menu']->id,
                    'tenant_id'      => $entry['menu']->tenant_id,
                    'menu_name'      => $entry['menu']->name,
                    'price'          => $entry['price'],
                    'quantity'       => $entry['qty'],
                    'subtotal'       => $entry['subtotal'],
                    'note'           => $entry['note'],
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan berhasil dicatat & pembayaran diterima!',
                'data' => $transaction->load('items.menu.tenant'),
            ]);
        });
    }

    public function printReceipt(Transaction $transaction)
    {
        $transaction->load(['items.menu', 'cashier']);
        return view('kasir.receipt', compact('transaction'));
    }
}
`,
  },

  // 5. ReportController.php
  {
    path: 'app/Http/Controllers/ReportController.php',
    name: 'ReportController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'Kompilasi laporan penjualan harian real-time, omset per tenant, bagi hasil komisi, dan ekspor CSV/Excel.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Transaction;
use App\\Models\\Tenant;
use App\\Models\\TransactionItem;
use Illuminate\\Http\\Request;
use Carbon\\Carbon;

class ReportController extends Controller
{
    public function dailyReport(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());

        // Ringkasan metrik harian
        $transactions = Transaction::whereDate('created_at', $date)
            ->where('payment_status', 'paid')
            ->with(['items.tenant'])
            ->get();

        $totalSales = $transactions->sum('total');
        $totalOrders = $transactions->count();
        $averageBasket = $totalOrders > 0 ? ($totalSales / $totalOrders) : 0;

        // Breakdown omset per tenant
        $tenantSales = TransactionItem::whereHas('transaction', function ($q) use ($date) {
                $q->whereDate('created_at', $date)->where('payment_status', 'paid');
            })
            ->selectRaw('tenant_id, sum(subtotal) as gross_sales, count(id) as total_items')
            ->groupBy('tenant_id')
            ->with('tenant')
            ->get();

        return view('laporan.index', compact(
            'date',
            'transactions',
            'totalSales',
            'totalOrders',
            'averageBasket',
            'tenantSales'
        ));
    }

    public function exportCsv(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());
        $transactions = Transaction::whereDate('created_at', $date)
            ->with('items')
            ->get();

        $filename = "laporan-penjualan-foodcourt-unugha-{$date}.csv";
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['No Invoice', 'Waktu', 'Pelanggan', 'Meja', 'Tipe', 'Total (Rp)', 'Metode', 'Status'];

        $callback = function() use ($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($transactions as $t) {
                fputcsv($file, [
                    $t->invoice_number,
                    $t->created_at->format('H:i:s'),
                    $t->customer_name,
                    $t->table_number,
                    $t->order_type,
                    $t->total,
                    strtoupper($t->payment_method),
                    $t->payment_status,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
`,
  },

  // 6. RoleMiddleware.php
  {
    path: 'app/Http/Middleware/RoleMiddleware.php',
    name: 'RoleMiddleware.php',
    folder: 'app/Http/Middleware',
    language: 'php',
    description: 'Memeriksa hak akses pengguna (kasir, admin, tenant) untuk memastikan keamanan operasional FoodCourt UNUGHA.',
    code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('warning', 'Silakan login terlebih dahulu.');
        }

        $user = Auth::user();

        if (!in_array($user->role, $roles)) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk halaman ini.');
        }

        return $next($request);
    }
}
`,
  },

  // 7. Models
  {
    path: 'app/Models/User.php',
    name: 'User.php',
    folder: 'app/Models',
    language: 'php',
    description: 'Model autentikasi user UNUGHA dengan atribut role (admin, kasir, tenant).',
    code: `<?php

namespace App\\Models;

use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role', // 'admin', 'kasir', 'tenant'
        'tenant_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'cashier_id');
    }
}
`,
  },
  {
    path: 'app/Models/Tenant.php',
    name: 'Tenant.php',
    folder: 'app/Models',
    language: 'php',
    description: 'Model mitra stand/tenant yang berjualan di FoodCourt UNUGHA.',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'stand_number',
        'owner_name',
        'phone',
        'category_desc',
        'status', // 'active', 'closed'
        'commission_rate',
    ];

    public function menus()
    {
        return $this->hasMany(Menu::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
`,
  },
  {
    path: 'app/Models/Menu.php',
    name: 'Menu.php',
    folder: 'app/Models',
    language: 'php',
    description: 'Model item menu makanan/minuman dengan referensi tenant dan kategori.',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Menu extends Model
{
    protected $fillable = [
        'tenant_id',
        'category_id',
        'name',
        'price',
        'description',
        'image',
        'stock',
        'is_available',
        'sku',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
`,
  },
  {
    path: 'app/Models/Category.php',
    name: 'Category.php',
    folder: 'app/Models',
    language: 'php',
    description: 'Model kategori menu (Makanan Berat, Minuman, Cemilan, Paket Hemat).',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'description',
    ];

    public function menus()
    {
        return $this->hasMany(Menu::class);
    }
}
`,
  },
  {
    path: 'app/Models/Transaction.php',
    name: 'Transaction.php',
    folder: 'app/Models',
    language: 'php',
    description: 'Model transaksi penjualan kasir FoodCourt UNUGHA dengan QRIS / Tunai.',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Transaction extends Model
{
    protected $fillable = [
        'invoice_number',
        'cashier_id',
        'customer_name',
        'table_number',
        'order_type', // 'dine_in', 'take_away'
        'subtotal',
        'discount_type',
        'discount_amount',
        'tax_amount',
        'total',
        'payment_method', // 'qris', 'cash', 'transfer', 'ewallet'
        'amount_paid',
        'change',
        'payment_status', // 'paid', 'pending'
        'kitchen_status', // 'diterima', 'dimasak', 'siap', 'selesai'
    ];

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
`,
  },
  {
    path: 'app/Models/TransactionItem.php',
    name: 'TransactionItem.php',
    folder: 'app/Models',
    language: 'php',
    description: 'Model item transaksi detail yang menghubungkan pesanan ke tenant terkait.',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class TransactionItem extends Model
{
    protected $fillable = [
        'transaction_id',
        'menu_id',
        'tenant_id',
        'menu_name',
        'price',
        'quantity',
        'subtotal',
        'note',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
`,
  },

  // 8. Migration
  {
    path: 'database/migrations/2026_10_01_000001_create_foodcourt_tables.php',
    name: '2026_10_01_create_foodcourt_tables.php',
    folder: 'database/migrations',
    language: 'php',
    description: 'Skema database lengkap FoodCourt UNUGHA: users, tenants, categories, menus, transactions, transaction_items.',
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('stand_number', 20)->unique();
            $table->string('owner_name', 100);
            $table->string('phone', 20);
            $table->string('category_desc')->nullable();
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->decimal('commission_rate', 5, 2)->default(10.00);
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('icon', 50)->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('sku', 50)->unique();
            $table->string('name', 150);
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('stock')->default(0);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number', 50)->unique();
            $table->foreignId('cashier_id')->constrained('users');
            $table->string('customer_name', 100);
            $table->string('table_number', 30);
            $table->enum('order_type', ['dine_in', 'take_away'])->default('dine_in');
            $table->decimal('subtotal', 14, 2);
            $table->string('discount_type', 30)->default('none');
            $table->decimal('discount_amount', 14, 2)->default(0);
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->decimal('total', 14, 2);
            $table->enum('payment_method', ['qris', 'cash', 'transfer', 'ewallet'])->default('cash');
            $table->decimal('amount_paid', 14, 2);
            $table->decimal('change', 14, 2)->default(0);
            $table->enum('payment_status', ['paid', 'pending'])->default('paid');
            $table->enum('kitchen_status', ['diterima', 'dimasak', 'siap', 'selesai'])->default('diterima');
            $table->timestamps();
        });

        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('menu_id')->constrained();
            $table->foreignId('tenant_id')->constrained();
            $table->string('menu_name', 150);
            $table->decimal('price', 12, 2);
            $table->integer('quantity');
            $table->decimal('subtotal', 14, 2);
            $table->string('note', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('tenants');
    }
};
`,
  },

  // 9. Blade Views
  {
    path: 'resources/views/auth/login.blade.php',
    name: 'login.blade.php',
    folder: 'resources/views/auth',
    language: 'blade',
    description: 'Tampilan autentikasi login hijau nuansa khas UNUGHA Cilacap.',
    code: `@extends('layouts.app')

@section('title', 'Login - Kasir FoodCourt UNUGHA')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-emerald-100">
        <div class="text-center mb-8">
            <div class="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-inner">
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-800">FoodCourt UNUGHA</h1>
            <p class="text-sm text-slate-500">Universitas Nahdlatul Ulama Al Ghazali Cilacap</p>
        </div>

        @if ($errors->any())
            <div class="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login.post') }}" method="POST" class="space-y-5">
            @csrf
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Username / ID Pegawai</label>
                <input type="text" name="username" value="{{ old('username') }}" required autofocus
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                       placeholder="Contoh: kasir1 / admin">
            </div>

            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                       placeholder="••••••••">
            </div>

            <button type="submit" class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition">
                Masuk Sistem Kasir
            </button>
        </form>
    </div>
</div>
@endsection
`,
  },
  {
    path: 'resources/views/kasir/index.blade.php',
    name: 'index.blade.php',
    folder: 'resources/views/kasir',
    language: 'blade',
    description: 'Tampilan antarmuka kasir POS: katalog menu per tenant, keranjang belanja, kalkulator diskon KTM UNUGHA, dan bayar QRIS.',
    code: `@extends('layouts.app')

@section('title', 'Point of Sale - Kasir FoodCourt UNUGHA')

@section('content')
<div class="flex h-screen overflow-hidden bg-slate-100">
    <!-- Menu Katalog (Kiri) -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Bar Filter -->
        <div class="bg-white p-4 border-b flex items-center justify-between shadow-sm">
            <div>
                <h1 class="font-bold text-lg text-emerald-800">Katalog Menu FoodCourt UNUGHA</h1>
                <p class="text-xs text-slate-500">Pencatatan Pesanan Multi-Tenant Real-Time</p>
            </div>
            <input type="text" placeholder="Cari nama menu atau stand..." class="px-4 py-2 border rounded-xl text-sm w-72">
        </div>

        <!-- Grid Menu -->
        <div class="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @foreach($menus as $menu)
                <div class="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col justify-between">
                    <div>
                        <div class="h-32 bg-slate-100 rounded-xl overflow-hidden mb-3">
                            <img src="{{ asset('storage/' . $menu->image) }}" class="w-full h-full object-cover">
                        </div>
                        <span class="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">{{ $menu->tenant->name }}</span>
                        <h3 class="font-semibold text-slate-800 mt-1 line-clamp-1">{{ $menu->name }}</h3>
                    </div>
                    <div class="flex items-center justify-between mt-3 pt-2 border-t">
                        <span class="font-bold text-emerald-700">Rp {{ number_format($menu->price, 0, ',', '.') }}</span>
                        <button class="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs">+ Tambah</button>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Order Cart & Payment (Kanan) -->
    <div class="w-96 bg-white border-l flex flex-col h-full shadow-lg">
        <div class="p-4 border-b bg-emerald-800 text-white">
            <h2 class="font-bold text-base">Pesanan Baru (Order Cart)</h2>
            <p class="text-xs text-emerald-200">Kasir: {{ Auth::user()->name }}</p>
        </div>
        <!-- Item List, Discount, QRIS button, Cetak Struk -->
    </div>
</div>
@endsection
`,
  },
  {
    path: 'resources/views/admin/dashboard.blade.php',
    name: 'dashboard.blade.php',
    folder: 'resources/views/admin',
    language: 'blade',
    description: 'Dashboard admin foodcourt: monitoring transaksi live, manajemen tenant mitra, & kontrol stok menu.',
    code: `@extends('layouts.app')

@section('title', 'Admin Dashboard - FoodCourt UNUGHA')

@section('content')
<div class="p-8 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-2xl font-black text-slate-800">Dashboard Pengelola FoodCourt UNUGHA</h1>
            <p class="text-sm text-slate-500">Monitoring omset tenant, stok dapur, dan efisiensi pesanan harian</p>
        </div>
        <a href="{{ route('laporan.index') }}" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow">
            Lihat Laporan Penjualan Real-Time
        </a>
    </div>

    <!-- Statistik Ringkas -->
    <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p class="text-xs text-slate-400 font-semibold uppercase">Total Mitra Stand</p>
            <h3 class="text-3xl font-extrabold text-slate-800 mt-1">5 Stand</h3>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p class="text-xs text-slate-400 font-semibold uppercase">Total Menu Aktif</p>
            <h3 class="text-3xl font-extrabold text-emerald-600 mt-1">24 Menu</h3>
        </div>
    </div>
</div>
@endsection
`,
  },
  {
    path: 'resources/views/laporan/index.blade.php',
    name: 'index.blade.php',
    folder: 'resources/views/laporan',
    language: 'blade',
    description: 'Halaman laporan penjualan harian real-time dengan grafik jam sibuk, tabel bagi hasil tenant, & export CSV.',
    code: `@extends('layouts.app')

@section('title', 'Laporan Penjualan Harian Real-Time - UNUGHA')

@section('content')
<div class="p-8 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Laporan Penjualan Harian Real-Time</h1>
            <p class="text-sm text-slate-500">FoodCourt Universitas Nahdlatul Ulama Al Ghazali Cilacap</p>
        </div>
        <div class="flex gap-3">
            <a href="{{ route('laporan.export.csv', ['date' => $date]) }}" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                Download CSV / Excel
            </a>
            <button onclick="window.print()" class="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                Cetak Rekap
            </button>
        </div>
    </div>
</div>
@endsection
`,
  },

  // 10. routes/web.php
  {
    path: 'routes/web.php',
    name: 'web.php',
    folder: 'routes',
    language: 'php',
    description: 'Definisi routing web lengkap dengan proteksi RoleMiddleware untuk Kasir, Admin, dan Tenant.',
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\TransactionController;
use App\\Http\\Controllers\\MenuController;
use App\\Http\\Controllers\\TenantController;
use App\\Http\\Controllers\\ReportController;

/*
|--------------------------------------------------------------------------
| Web Routes - Aplikasi Kasir FoodCourt UNUGHA
|--------------------------------------------------------------------------
*/

// Autentikasi Pengguna
Route::get('/', [AuthController::class, 'showLoginForm'])->name('home');
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Group Route Terproteksi Auth
Route::middleware(['auth'])->group(function () {

    // Kasir POS Routes
    Route::middleware(['role:kasir,admin'])->prefix('kasir')->name('kasir.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::post('/order', [TransactionController::class, 'store'])->name('order.store');
        Route::get('/receipt/{transaction}', [TransactionController::class, 'printReceipt'])->name('receipt');
    });

    // Laporan Penjualan Real-Time
    Route::middleware(['role:admin,kasir'])->prefix('laporan')->name('laporan.')->group(function () {
        Route::get('/', [ReportController::class, 'dailyReport'])->name('index');
        Route::get('/export/csv', [ReportController::class, 'exportCsv'])->name('export.csv');
    });

    // Admin & Pengelola Foodcourt
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return view('admin.dashboard');
        })->name('dashboard');

        // CRUD Menu
        Route::resource('menus', MenuController::class);
        Route::patch('menus/{menu}/stock', [MenuController::class, 'updateStock'])->name('menus.stock');

        // CRUD Tenant
        Route::resource('tenants', TenantController::class);
        Route::patch('tenants/{tenant}/toggle', [TenantController::class, 'toggleStatus'])->name('tenants.toggle');

        // CRUD User Kasir (FR-03)
        Route::resource('users', UserController::class);

        // Pengaturan Sistem & Struk (FR-1, FR-2)
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
    });
});
`,
  },

  // UserController.php (FR-03)
  {
    path: 'app/Http/Controllers/UserController.php',
    name: 'UserController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'FR-03: Controller admin untuk menambah, mengedit, dan mengelola user kasir dan administrator.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name')->paginate(10);
        return view('admin.users.index', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,kasir',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = true;

        User::create($validated);

        return redirect()->back()->with('success', 'User kasir berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:100',
            'username'  => 'required|string|max:50|unique:users,username,' . $user->id,
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'password'  => 'nullable|string|min:6',
            'role'      => 'required|in:admin,kasir',
            'is_active' => 'required|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Data user kasir berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'Akun user berhasil dihapus.');
    }
}
`,
  },

  // SettingController.php (FR-1, FR-2)
  {
    path: 'app/Http/Controllers/SettingController.php',
    name: 'SettingController.php',
    folder: 'app/Http/Controllers',
    language: 'php',
    description: 'Pengaturan FR-1 & FR-2: Mengelola konfigurasi nama foodcourt, alamat, logo, dan format nomor struk.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Setting;
use Illuminate\\Http\\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.settings.index', compact('settings'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'foodcourt_name'    => 'required|string|max:100',
            'campus_name'       => 'required|string|max:150',
            'address'           => 'required|string|max:255',
            'phone'             => 'nullable|string|max:30',
            'receipt_footer'    => 'nullable|string|max:255',
            'receipt_prefix'    => 'required|string|max:10',
            'receipt_separator' => 'required|string|max:2',
            'receipt_digits'    => 'required|integer|min:3|max:6',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return redirect()->back()->with('success', 'Pengaturan sistem & format struk berhasil disimpan.');
    }
}
`,
  },
];
