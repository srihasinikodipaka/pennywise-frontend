import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

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
  'Salary',
  'Investment',
  'Freelance',
  'Other'
];

const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'];

export const TransactionModal = ({ isOpen, onClose, onSave, editingTransaction }) => {
  const { currency } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: '',
  });

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'EXPENSE',
        category: editingTransaction.category || 'Food & Dining',
        date: editingTransaction.date || new Date().toISOString().split('T')[0],
        paymentMethod: editingTransaction.paymentMethod || 'UPI',
        notes: editingTransaction.notes || '',
      });
      setAiSuggestion(null);
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'EXPENSE',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        notes: '',
      });
      setAiSuggestion(null);
    }
    setError('');
  }, [editingTransaction, isOpen]);

  // Real-time AI Categorization as user types description (debounced)
  useEffect(() => {
    if (!formData.title || formData.title.trim().length < 3 || editingTransaction) {
      setAiSuggestion(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsCategorizing(true);
        const res = await api.post('/ai/categorize', { description: formData.title });
        if (res.data && res.data.suggestedCategory && res.data.suggestedCategory !== 'Other') {
          setAiSuggestion(res.data);
          // Auto-apply AI suggestion if currently default
          setFormData((prev) => {
            if (prev.category === 'Food & Dining' || prev.category === 'Other') {
              return { ...prev, category: res.data.suggestedCategory };
            }
            return prev;
          });
        } else {
          setAiSuggestion(null);
        }
      } catch (err) {
        // Silent failure for inline helper
      } finally {
        setIsCategorizing(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.title]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingTransaction?.id) {
        await api.put(`/transactions/${editingTransaction.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-[#E6E8EC] rounded-2xl shadow-xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#687789] hover:text-[#24364B] p-1.5 rounded-lg hover:bg-[#FAF9F5] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <h2 className="text-base font-bold text-[#24364B] tracking-tight">
            {editingTransaction ? 'Edit transaction' : 'Record a transaction'}
          </h2>
          <p className="text-xs text-[#687789] mt-0.5">
            {editingTransaction
              ? 'Update the details below to keep your records accurate.'
              : 'Add an expense or income entry. Categories can be auto-suggested.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF9F5] rounded-xl border border-[#E6E8EC]">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                formData.type === 'EXPENSE'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold shadow-xs'
                  : 'text-[#687789] hover:text-[#24364B]'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'INCOME' })}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                formData.type === 'INCOME'
                  ? 'bg-[#DDEFE4] text-[#2B6A43] border border-[#b8dfc4] font-semibold shadow-xs'
                  : 'text-[#687789] hover:text-[#24364B]'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#24364B] mb-1">
              Description / Merchant
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Grocery store, Electric bill, Monthly stipend..."
              required
              className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl px-3.5 py-2.5 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
            />
          </div>

          {/* AI Explainable Suggestion Banner */}
          {aiSuggestion && (
            <div className="p-3 bg-[#E8F3FF] border border-[#BBD9F5] rounded-xl flex items-start gap-2.5 animate-fade-in">
              <Sparkles className="w-4 h-4 text-[#477EAD] shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#24364B]">
                    Suggested category: {aiSuggestion.suggestedCategory}
                  </span>
                  <span className="text-[10px] bg-white border border-[#BBD9F5] text-[#477EAD] px-1.5 py-0.2 rounded font-medium">
                    {Math.round(aiSuggestion.confidence * 100)}% match
                  </span>
                </div>
                <p className="text-[11px] text-[#687789] mt-0.5">
                  {aiSuggestion.ruleExplanation}
                </p>
              </div>
            </div>
          )}

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#24364B] mb-1">
                Amount ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#687789]">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-8 pr-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#24364B] mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl px-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#24364B] mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl px-3 py-2 text-xs text-[#24364B] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#24364B] mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Split with room partner"
              className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl px-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
            />
          </div>

          {/* Submit Actions */}
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
              <span>{submitting ? 'Saving...' : (editingTransaction ? 'Save Changes' : 'Record Transaction')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
