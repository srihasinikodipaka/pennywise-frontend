import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Sparkles, 
  Calendar,
  Tag,
  ArrowUpDown,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Education',
  'Salary',
  'Investment',
  'Freelance',
  'Other'
];

export const TransactionsView = ({ openAddTxModal, openEditTxModal }) => {
  const { currency, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/transactions', { params });
      setTransactions(res.data);
    } catch (err) {
      setError('Could not load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, typeFilter, categoryFilter]);

  // Debounced search
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete the entry for "${title}"?`)) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      alert('Could not delete the transaction. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#24364B]">Transactions</h1>
          <p className="text-xs text-[#687789] mt-0.5">
            Your recorded expenses and income entries
          </p>
        </div>

        <button
          onClick={openAddTxModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Record transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="penny-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#687789]" />
            <input
              type="text"
              placeholder="Search by title, description, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-9 pr-4 py-2 text-xs text-[#24364B] placeholder-[#687789] focus:outline-none focus:border-[#477EAD] transition-colors"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex items-center bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl p-1 text-xs w-full md:w-auto">
            {['ALL', 'EXPENSE', 'INCOME'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`flex-1 md:flex-initial px-3 py-1 rounded-lg font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-white text-[#477EAD] font-semibold shadow-xs border border-[#E6E8EC]'
                    : 'text-[#687789] hover:text-[#24364B]'
                }`}
              >
                {type === 'ALL' ? 'All' : (type === 'EXPENSE' ? 'Expenses' : 'Income')}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl px-3 py-2 text-xs text-[#24364B] focus:outline-none focus:border-[#477EAD]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="penny-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#687789] flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#477EAD] border-t-transparent rounded-full animate-spin" />
            <span>Loading records...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#687789] px-4">
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-[#687789] uppercase text-[10px] tracking-wider border-b border-[#E6E8EC]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Payment mode</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EC]">
                {transactions.map((tx) => {
                  const isExpense = tx.type === 'EXPENSE';
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#24364B]">{tx.title}</div>
                        {tx.notes && <div className="text-[11px] text-[#687789] mt-0.5">{tx.notes}</div>}
                        {tx.matchedRule && (
                          <div className="text-[10px] text-[#477EAD] mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>Auto-categorized</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#E8F3FF] text-[#24364B] border border-[#BBD9F5]">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#687789] font-mono text-[11px]">
                        {tx.date}
                      </td>
                      <td className="py-3 px-4 text-[#687789] text-[11px]">
                        {tx.paymentMethod || 'UPI'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={isExpense ? 'text-[#24364B]' : 'text-[#2B6A43]'}>
                          {isExpense ? '-' : '+'}{currency}{Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditTxModal(tx)}
                            className="p-1.5 text-[#687789] hover:text-[#477EAD] hover:bg-[#E8F3FF] rounded-lg transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id, tx.title)}
                            className="p-1.5 text-[#687789] hover:text-[#9B2C2C] hover:bg-[#FDE8E8] rounded-lg transition-colors"
                            title="Delete transaction"
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
        )}
      </div>
    </div>
  );
};
