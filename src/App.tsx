import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useInventory } from './hooks/useInventory';
import { useState } from 'react';
import { LayoutDashboard, Package, Plus, Minus, Trash2, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Dashboard Page ---
const Dashboard = () => {
  const { products } = useInventory();
  
  const totalItems = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">รายการสินค้าทั้งหมด</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">{totalItems}</span>
            <span className="text-slate-400">ชนิด</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">มูลค่ารวมของสต๊อก</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-indigo-600">฿{totalValue.toLocaleString()}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between ${outOfStockCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}
        >
          <span className={`${outOfStockCount > 0 ? 'text-red-600' : 'text-slate-500'} text-sm font-medium uppercase tracking-wider`}>สินค้าที่ของหมด</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${outOfStockCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>{outOfStockCount}</span>
            <span className="text-slate-400">รายการ</span>
          </div>
        </motion.div>
      </div>

      {outOfStockCount > 0 && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="font-medium">มีสินค้า {outOfStockCount} รายการที่ต้องการการเติมสต๊อกด่วน!</p>
        </div>
      )}
    </div>
  );
};

// --- Products Management Page ---
const Products = () => {
  const { products, addProduct, updateQuantity, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newQty, setNewQty] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newQty) return;
    addProduct(newName, parseFloat(newPrice), parseInt(newQty));
    setNewName('');
    setNewPrice('');
    setNewQty('');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800">จัดการสินค้า</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อสินค้า..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-indigo-600" />
          เพิ่มสินค้าใหม่
        </h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="ชื่อสินค้า" 
            required
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="ราคา" 
            required
            min="0"
            step="0.01"
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="จำนวนเริ่มต้น" 
            required
            min="0"
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            เพิ่มสินค้า
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-5 rounded-2xl border transition-all ${product.quantity === 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                  <p className="text-indigo-600 font-semibold">฿{product.price.toLocaleString()}</p>
                </div>
                {product.quantity === 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    สินค้าหมด
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <button 
                    onClick={() => updateQuantity(product.id, -1)}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600 disabled:opacity-30"
                    disabled={product.quantity === 0}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-800">{product.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(product.id, 1)}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="ลบสินค้า"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Package className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">ไม่พบสินค้าที่คุณกำลังมองหา</p>
        </div>
      )}
    </div>
  );
};

// --- Main Layout ---
const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Package size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">mini Inventory</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/products" icon={Package} label="จัดการสินค้า" />
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">ระบบพร้อมใช้งาน</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
