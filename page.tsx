 "use client";
import { useMemo, useState } from "react";
import { LayoutDashboard, ClipboardList, CalendarDays, Wallet, Users, History, Settings, Scissors, Plus, Search, Bell, ArrowUpRight, ArrowDownRight, Menu, X, LogOut, CircleDollarSign, CreditCard, Banknote, TrendingUp, ChevronDown } from "lucide-react";

type ServiceKey = "haircut" | "keramas" | "hairstyling" | "shaving" | "tonic";
type Service = { key: ServiceKey; name: string; price: number; customers: number };
type Expense = { id: number; date: string; category: string; note: string; amount: number };
type Salary = { id: number; date: string; note: string; amount: number };
const initialServices: Service[] = [
  { key: "haircut", name: "Haircut", price: 20000, customers: 18 },
  { key: "keramas", name: "Keramas", price: 5000, customers: 9 },
  { key: "hairstyling", name: "Hairstyling", price: 5000, customers: 6 },
  { key: "shaving", name: "Shaving", price: 5000, customers: 4 },
  { key: "tonic", name: "Hair Tonic", price: 10000, customers: 3 },
];
const idr = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const today = new Date().toISOString().slice(0,10);
const monthLabel = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date());
const nav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Laporan Harian", icon: ClipboardList },
  { label: "Laporan Bulanan", icon: CalendarDays },
  { label: "Pengeluaran", icon: Wallet },
  { label: "Gaji Karyawan", icon: Users },
  { label: "Riwayat Laporan", icon: History },
  { label: "Pengaturan", icon: Settings },
];
export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [date, setDate] = useState(today);
  const [services, setServices] = useState(initialServices);
  const [qris, setQris] = useState(150000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: today, category: "Listrik", note: "Tagihan listrik", amount: 150000 },
    { id: 2, date: today, category: "Perlengkapan cukur", note: "Pisau dan cape", amount: 65000 },
  ]);
  const [salaries, setSalaries] = useState<Salary[]>([
    { id: 1, date: today, note: "Pembayaran gaji", amount: 2000000 },
  ]);
  const [showExpense, setShowExpense] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ date: today, category: "Listrik", note: "", amount: "" });
  const [salaryForm, setSalaryForm] = useState({ date: today, note: "", amount: "" });
  const [servicePrices, setServicePrices] = useState(false);
  const [priceDraft, setPriceDraft] = useState(initialServices.map(s => String(s.price)));
  const [saved, setSaved] = useState(false);

  const serviceIncome = services.reduce((sum, s) => sum + s.price * s.customers, 0);
  const customers = services.reduce((sum, s) => sum + s.customers, 0);
  const cash = serviceIncome - qris;
  const totalExpenses = expenses.filter(e => e.date.slice(0,7) === date.slice(0,7)).reduce((sum,e) => sum + e.amount,0);
  const totalSalaries = salaries.filter(s => s.date.slice(0,7) === date.slice(0,7)).reduce((sum,s) => sum + s.amount,0);
  const net = serviceIncome - totalExpenses - totalSalaries;
  const monthExpenses = expenses.filter(e => e.date.slice(0,7) === date.slice(0,7));
  const monthSalaries = salaries.filter(s => s.date.slice(0,7) === date.slice(0,7));
  const moneyCards = [
    { title: "Total Pemasukan", value: serviceIncome, icon: CircleDollarSign, change: "+8,4%", positive: true, color: "green" },
    { title: "Total Pengeluaran", value: totalExpenses, icon: Wallet, change: "+2,1%", positive: false, color: "red" },
    { title: "Gaji Dibayarkan", value: totalSalaries, icon: Users, change: "Bulan ini", positive: null, color: "purple" },
    { title: "Sisa Bersih", value: net, icon: TrendingUp, change: "+5,2%", positive: true, color: "blue" },
  ];
  function updateCustomers(key: ServiceKey, value: string) {
    const count = Math.max(0, Math.floor(Number(value) || 0));
    setServices(prev => prev.map(s => s.key === key ? { ...s, customers: count } : s));
    setSaved(false);
  }
  function addExpense(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(expenseForm.amount);
    if (!amount || amount < 0 || !expenseForm.date) return;
    setExpenses(prev => [{ id: Date.now(), ...expenseForm, amount }, ...prev]);
    setExpenseForm({ date, category: "Listrik", note: "", amount: "" });
    setShowExpense(false);
  }
  function addSalary(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(salaryForm.amount);
    if (!amount || amount < 0 || !salaryForm.date) return;
    setSalaries(prev => [{ id: Date.now(), ...salaryForm, amount }, ...prev]);
    setSalaryForm({ date, note: "", amount: "" });
    setShowSalary(false);
  }
  function savePrices(e: React.FormEvent) {
    e.preventDefault();
    setServices(prev => prev.map((s,i) => ({...s, price: Math.max(0, Number(priceDraft[i]) || 0})));
    setServicePrices(false);
  }
  const pageTitle = active;
  const [historySearch, setHistorySearch] = useState("");
  const filteredExpenses = useMemo(() => monthExpenses.filter(e => (e.category + " " + e.note).toLowerCase().includes(historySearch.toLowerCase())), [monthExpenses, historySearch]);

  return <main className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Scissors size={22}/></div><div><strong>WZ<span>1</span></strong><small>BUSINESS FINANCE</small></div><button className="close-nav" onClick={() => setMobileNav(false)}><X size={20}/></button></div>
      <div className="workspace"><div className="workspace-avatar">WZ</div><div><strong>WZ Barbershop</strong><small>Owner Workspace</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">MENU UTAMA</div>
      <nav>{nav.map(item => <button key={item.label} className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => { setActive(item.label); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{item.label === "Riwayat Laporan" && <span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="secure-badge"><div className="secure-icon">✓</div><div><strong>Owner Access</strong><small>Data keuangan privat</small></div></div><div className="profile"><div className="profile-avatar">O</div><div className="profile-info"><strong>Owner WZ</strong><small>Administrator</small></div><LogOut size={17}/></div></div>
    </aside>
    {mobileNav && <button className="mobile-overlay" aria-label="Tutup menu" onClick={() => setMobileNav(false)}/>}
    <section className="main-panel">
      <header className="topbar"><button className="menu-toggle" onClick={() => setMobileNav(true)}><Menu/></button><div className="breadcrumb">WZ Barbershop <span>/</span> <strong>{pageTitle}</strong></div><div className="top-actions"><div className="online-status"><i/> Database online</div><button className="icon-button" aria-label="Notifikasi"><Bell size={18}/><b/></button><div className="top-avatar">O</div></div></header>
      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow">RINGKASAN KEUANGAN</div><h1>{pageTitle === "Dashboard" ? "Dashboard" : pageTitle}</h1><p>Pantau performa keuangan WZ Barbershop dengan mudah.</p></div><div className="heading-actions"><label className="date-picker"><CalendarDays size={17}/><input type="date" value={date} onChange={e => setDate(e.target.value)}/></label><button className="primary-button" onClick={() => { setActive("Laporan Harian"); setSaved(true); }}><Plus size={17}/> <span>Simpan Laporan</span></button></div></div>
        {saved && <div className="notice success">Laporan ditandai tersimpan pada tampilan demo. Hubungkan Supabase untuk penyimpanan permanen.</div>}
        {active === "Dashboard" && <>
          <div className="metric-grid">{moneyCards.map(card => <div className="metric-card" key={card.title}><div className="metric-top"><span>{card.title}</span><div className={`metric-icon ${card.color}`}><card.icon size={19}/></div></div><strong className="metric-value">{idr(card.value)}</strong><div className="metric-bottom">{card.positive === true ? <ArrowUpRight size={15} className="up"/> : card.positive === false ? <ArrowDownRight size={15} className="down"/> : <span className="neutral-dot"/>}<span className={card.positive === true ? "up" : card.positive === false ? "down" : "muted"}>{card.change}</span><span className="muted"> dibanding periode lalu</span></div></div>)}</div>
          <div className="secondary-grid"><div className="panel service-panel"><div className="panel-header"><div><h2>Pelanggan & Pemasukan Layanan</h2><p>Input jumlah pelanggan per layanan</p></div><button className="text-button" onClick={() => {setPriceDraft(services.map(s => String(s.price))); setServicePrices(true);}}>Edit harga</button></div><div className="service-table"><div className="table-head"><span>LAYANAN</span><span>HARGA</span><span>PELANGGAN</span><span>TOTAL</span></div>{services.map(s => <div className="service-row" key={s.key}><div className="service-name"><div className="service-symbol"><Scissors size={15}/></div><strong>{s.name}</strong></div><span className="price">{idr(s.price)}</span><input className="customer-input" aria-label={`Pelanggan ${s.name}`} type="number" min="0" value={s.customers} onChange={e => updateCustomers(s.key,e.target.value)}/><strong className="service-total">{idr(s.price*s.customers)}</strong></div>)}</div><div className="service-summary"><div><small>Total pelanggan</small><strong>{customers} <span>orang</span></strong></div><div><small>Total pemasukan layanan</small><strong className="green-text">{idr(serviceIncome)}</strong></div></div></div>
          <div className="panel payment-panel"><div className="panel-header"><div><h2>Metode Pembayaran</h2><p>Rincian pemasukan hari ini</p></div><span className="live-pill"><i/> Live</span></div><div className="payment-total"><small>Total pemasukan</small><strong>{idr(serviceIncome)}</strong><span>Gabungan QRIS dan tunai</span></div><div className="payment-line"><div className="payment-label"><div className="payment-symbol qris"><CreditCard size={17}/></div><div><strong>QRIS</strong><small>Nominal aktual transaksi</small></div></div><input aria-label="Nominal QRIS" type="number" min="0" value={qris} onChange={e => setQris(Math.max(0, Number(e.target.value)||0))}/></div><div className="payment-line"><div className="payment-label"><div className="payment-symbol cash"><Banknote size={17}/></div><div><strong>Tunai</strong><small>Dihitung otomatis</small></div></div><strong className={cash < 0 ? "red-text" : ""}>{idr(cash)}</strong></div>{cash < 0 && <div className="notice warning">QRIS lebih besar dari total layanan. Periksa nominal sebelum menyimpan.</div>}<div className="payment-foot"><span>QRIS + tunai</span><strong>{idr(qris + cash)}</strong></div></div></div>
          <div className="bottom-grid"><div className="panel"><div className="panel-header"><div><h2>Pengeluaran Terbaru</h2><p>Catatan biaya operasional</p></div><button className="text-button" onClick={() => setActive("Pengeluaran")}>Lihat semua <ArrowUpRight size={14}/></button></div><div className="compact-list">{monthExpenses.slice(0,3).map(e => <div className="compact-row" key={e.id}><div className="list-icon expense"><Wallet size={16}/></div><div className="list-main"><strong>{e.category}</strong><small>{e.note || "Tanpa keterangan"} · {e.date}</small></div><strong className="red-text">−{idr(e.amount)}</strong></div>)}</div><button className="add-row" onClick={() => setShowExpense(true)}><Plus size={16}/> Tambah pengeluaran</button></div><div className="panel"><div className="panel-header"><div><h2>Gaji Karyawan</h2><p>Riwayat pembayaran bulan ini</p></div><button className="text-button" onClick={() => setActive("Gaji Karyawan")}>Lihat semua <ArrowUpRight size={14}/></button></div><div className="salary-summary"><div className="salary-illustration"><Users size={24}/></div><div><small>Total gaji dibayarkan</small><strong>{idr(totalSalaries)}</strong><span>{monthSalaries.length} catatan pembayaran</span></div></div><button className="add-row" onClick={() => setShowSalary(true)}><Plus size={16}/> Catat pembayaran gaji</button></div></div>
        </>}
        {active === "Laporan Harian" && <div className="panel full-panel"><div className="panel-header"><div><h2>Laporan Harian</h2><p>Periksa data pelanggan, pemasukan, dan biaya sebelum menyimpan.</p></div><span className="date-chip">{date}</span></div><div className="daily-summary-grid">{services.map(s=><div className="mini-stat" key={s.key}><span>{s.name}</span><strong>{s.customers}</strong><small>{idr(s.price*s.customers)}</small></div>)}<div className="mini-stat"><span>Total pelanggan</span><strong>{customers}</strong><small>orang</small></div></div><div className="report-lines"><div><span>Total pemasukan layanan</span><strong>{idr(serviceIncome)}</strong></div><div><span>Pembayaran QRIS</span><strong>{idr(qris)}</strong></div><div><span>Pembayaran tunai</span><strong>{idr(cash)}</strong></div><div><span>Total pengeluaran bulan ini</span><strong className="red-text">{idr(totalExpenses)}</strong></div><div><span>Total gaji dibayarkan bulan ini</span><strong className="red-text">{idr(totalSalaries)}</strong></div><div className="net-line"><span>Sisa bersih bulan ini</span><strong>{idr(net)}</strong></div></div><button className="primary-button" onClick={() => { if(cash < 0) { alert("Nominal QRIS melebihi total pemasukan layanan."); return; } setSaved(true); }}>✓ Validasi laporan</button></div>}
        {active === "Laporan Bulanan" && <><div className="metric-grid">{moneyCards.map(card=><div className="metric-card" key={card.title}><div className="metric-top"><span>{card.title}</span><div className={`metric-icon ${card.color}`}><card.icon size={19}/></div></div><strong className="metric-value">{idr(card.value)}</strong><div className="metric-bottom"><span className="muted">Periode {monthLabel}</span></div></div>)}</div><div className="panel full-panel"><div className="panel-header"><div><h2>Rekap pelanggan bulanan</h2><p>Jumlah layanan berdasarkan data yang diinput</p></div></div><div className="daily-summary-grid">{services.map(s=><div className="mini-stat" key={s.key}><span>{s.name}</span><strong>{s.customers}</strong><small>pelanggan</small></div>)}<div className="mini-stat"><span>Total</span><strong>{customers}</strong><small>pelanggan</small></div></div><div className="notice">Data pembanding bulan sebelumnya belum tersedia pada demo awal.</div></div></>}
        {active === "Pengeluaran" && <div className="panel full-panel"><div className="panel-header"><div><h2>Daftar Pengeluaran</h2><p>Setiap biaya dicatat terpisah berdasarkan tanggal dan kategori.</p></div><button className="primary-button" onClick={()=>setShowExpense(true)}><Plus size={16}/> Tambah pengeluaran</button></div><div className="toolbar"><div className="search-box"><Search size={16}/><input placeholder="Cari kategori atau keterangan..." value={historySearch} onChange={e=>setHistorySearch(e.target.value)}/></div><span className="muted">{filteredExpenses.length} catatan</span></div><div className="data-table"><div className="data-head"><span>TANGGAL</span><span>KATEGORI</span><span>KETERANGAN</span><span>NOMINAL</span></div>{filteredExpenses.map(e=><div className="data-row" key={e.id}><span>{e.date}</span><strong>{e.category}</strong><span>{e.note || "—"}</span><strong className="red-text">{idr(e.amount)}</strong></div>)}{filteredExpenses.length===0&&<div className="empty-state">Belum ada pengeluaran untuk filter ini.</div>}</div><div className="table-total"><span>Total pengeluaran bulan ini</span><strong className="red-text">{idr(totalExpenses)}</strong></div></div>}
        {active === "Gaji Karyawan" && <div className="panel full-panel"><div className="panel-header"><div><h2>Catatan Pembayaran Gaji</h2><p>Gaji dipisahkan dari pengeluaran agar tidak terhitung dua kali.</p></div><button className="primary-button" onClick={()=>setShowSalary(true)}><Plus size={16}/> Catat gaji</button></div><div className="salary-banner"><span>Total gaji dibayarkan bulan ini</span><strong>{idr(totalSalaries)}</strong></div><div className="data-table"><div className="data-head"><span>TANGGAL</span><span>KATEGORI</span><span>CATATAN</span><span>NOMINAL</span></div>{monthSalaries.map(s=><div className="data-row" key={s.id}><span>{s.date}</span><strong>Gaji karyawan</strong><span>{s.note||"—"}</span><strong className="red-text">{idr(s.amount)}</strong></div>)}</div></div>}
        {active === "Riwayat Laporan" && <div className="panel full-panel"><div className="panel-header"><div><h2>Riwayat Laporan</h2><p>Pilih tanggal di atas untuk melihat ringkasan periode.</p></div></div><div className="history-card"><div className="history-date"><CalendarDays size={20}/><div><strong>{date}</strong><small>Laporan harian · pratinjau lokal</small></div></div><div><small>Total pemasukan</small><strong>{idr(serviceIncome)}</strong></div><div><small>Total pelanggan</small><strong>{customers}</strong></div><div><small>Sisa bersih</small><strong>{idr(net)}</strong></div><button className="text-button" onClick={()=>setActive("Laporan Harian")}>Buka laporan <ArrowUpRight size={14}/></button></div><div className="notice warning">Penyimpanan pada versi ini masih sementara di browser. Ikuti README untuk mengaktifkan database Supabase agar data permanen dan bisa diakses lintas perangkat.</div></div>}
        {active === "Pengaturan" && <div className="panel full-panel"><div className="panel-header"><div><h2>Pengaturan Aplikasi</h2><p>Konfigurasi dasar Business Finance - WZ1.</p></div></div><div className="settings-row"><div><strong>Daftar harga layanan</strong><small>Ubah harga Haircut, Keramas, Hairstyling, Shaving, dan Hair Tonic.</small></div><button className="secondary-button" onClick={()=>{setPriceDraft(services.map(s=>String(s.price)));setServicePrices(true)}}>Edit harga</button></div><div className="settings-row"><div><strong>Database</strong><small>Supabase belum dikonfigurasi. Lihat README_SETUP.md.</small></div><span className="status-tag">Perlu dihubungkan</span></div><div className="settings-row"><div><strong>Akses</strong><small>Rancangan produksi harus menggunakan Supabase Auth dan Row Level Security.</small></div><span className="status-tag">Owner/Admin</span></div></div>}
      </div>
      <footer className="footer"><span>© 2026 Business Finance - WZ1</span><span><i/> Dashboard keuangan WZ Barbershop</span></footer>
    </section>
    {showExpense && <div className="modal-backdrop" onClick={()=>setShowExpense(false)}><form className="modal" onSubmit={addExpense} onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h2>Tambah Pengeluaran</h2><p>Catat biaya operasional usaha.</p></div><button type="button" className="icon-button" onClick={()=>setShowExpense(false)}><X size={18}/></button></div><label>Tanggal<input type="date" value={expenseForm.date} onChange={e=>setExpenseForm({...expenseForm,date:e.target.value})} required/></label><label>Kategori<select value={expenseForm.category} onChange={e=>setExpenseForm({...expenseForm,category:e.target.value})}>{["Gaji karyawan","Listrik","Air","WiFi","Sampah","Perlengkapan cukur","Pengeluaran lainnya"].filter(c=>c!=="Gaji karyawan").map(c=><option key={c}>{c}</option>)}</select></label><label>Keterangan<input placeholder="Contoh: tagihan bulan ini" value={expenseForm.note} onChange={e=>setExpenseForm({...expenseForm,note:e.target.value})}/></label><label>Nominal (Rp)<input type="number" min="1" placeholder="0" value={expenseForm.amount} onChange={e=>setExpenseForm({...expenseForm,amount:e.target.value})} required/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowExpense(false)}>Batal</button><button className="primary-button">Simpan pengeluaran</button></div></form></div>}
    {showSalary && <div className="modal-backdrop" onClick={()=>setShowSalary(false)}><form className="modal" onSubmit={addSalary} onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h2>Catat Pembayaran Gaji</h2><p>Catatan ini dihitung terpisah dari pengeluaran lain.</p></div><button type="button" className="icon-button" onClick={()=>setShowSalary(false)}><X size={18}/></button></div><label>Tanggal pembayaran<input type="date" value={salaryForm.date} onChange={e=>setSalaryForm({...salaryForm,date:e.target.value})} required/></label><label>Catatan<input placeholder="Contoh: gaji bulan Oktober" value={salaryForm.note} onChange={e=>setSalaryForm({...salaryForm,note:e.target.value})}/></label><label>Nominal (Rp)<input type="number" min="1" placeholder="0" value={salaryForm.amount} onChange={e=>setSalaryForm({...salaryForm,amount:e.target.value})} required/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowSalary(false)}>Batal</button><button className="primary-button">Simpan gaji</button></div></form></div>}
    {servicePrices && <div className="modal-backdrop" onClick={()=>setServicePrices(false)}><form className="modal" onSubmit={savePrices} onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h2>Edit Harga Layanan</h2><p>Harga baru digunakan untuk hitungan berikutnya.</p></div><button type="button" className="icon-button" onClick={()=>setServicePrices(false)}><X size={18}/></button></div>{services.map((s,i)=><label key={s.key}>{s.name}<input type="number" min="0" value={priceDraft[i]} onChange={e=>setPriceDraft(prev=>prev.map((v,j)=>i===j?e.target.value:v))} required/></label>)}<div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setServicePrices(false)}>Batal</button><button className="primary-button">Simpan harga</button></div></form></div>}
  </main>;
}