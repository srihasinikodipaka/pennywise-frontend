import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { X, Target, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Education',
  'Other'
];

export const BudgetModal = ({ isOpen, onClose, onSave, currentMonth, editingBudget }) => {
  const { currency } = useAuth();
  const [category, setCategory] = useState(editingBudget ? editingBudget.category : 'Food & Dining');
  const [limitAmount, setLimitAmount] = useState(editingBudget ? editingBudget.limitAmount : '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!limitAmount || Number(limitAmount) <= 0) {
      setError('Please specify a positive budget limit amount');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await api.post('/budgets', {
        category,
        limitAmount: parseFloat(limitAmount),
        month: currentMonth,
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget limit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#E6E8EC] rounded-2xl shadow-xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#687789] hover:text-[#24364B] p-1.5 rounded-lg hover:bg-[#FAF9F5] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3FF] border border-[#BBD9F5] text-[#477EAD] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24364B] tracking-tight">
              {editingBudget ? 'Update budget limit' : 'Set category budget'}
            </h2>
            <p className="text-xs text-[#687789]">Target period: {currentMonth}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#24364B] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl px-3 py-2 text-xs text-[#24364B] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#24364B] mb-1">
              Monthly Limit Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#687789]">{currency}</span>
              <input
                type="number"
                step="10"
                min="10"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                placeholder="5000"
                required
                className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-8 pr-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#687789] mt-1.5">
              Pennywise helps track your progress and gives clear warnings if spending nears the limit.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E8EC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#687789] hover:text-[#24364B] hover:bg-[#FAF9F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save Limit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
