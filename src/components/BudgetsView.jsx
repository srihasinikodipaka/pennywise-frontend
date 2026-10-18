import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Calendar
} from 'lucide-react';

export const BudgetsView = ({ openBudgetModal }) => {
  const { currency, isAuthenticated } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default to current year-month e.g. "2026-10"
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/budgets/status', {
        params: { month: currentMonth }
      });
      setBudgets(res.data);
    } catch (err) {
      setError('Could not load budget information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
    }
  }, [isAuthenticated, currentMonth]);

  const handleDeleteBudget = async (id, category) => {
    if (!window.confirm(`Remove budget target for ${category}?`)) return;
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets.filter((b) => b.id !== id));
    } catch (err) {
      alert('Could not remove budget target.');
    }
  };

  const totalBudgeted = budgets.reduce((acc, b) => acc + Number(b.limitAmount), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spentAmount), 0);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;
  const exceededBudgets = budgets.filter((b) => b.status === 'EXCEEDED');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#24364B]">Budgets</h1>
          <p className="text-xs text-[#687789] mt-0.5">
            Set spending limits to help keep everyday categories on track
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="bg-white border border-[#E6E8EC] rounded-xl px-3 py-1.5 text-xs text-[#24364B] focus:outline-none focus:border-[#477EAD] font-medium"
          />
          <button
            onClick={() => openBudgetModal(currentMonth)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Set category limit</span>
          </button>
        </div>
      </div>

      {/* Gentle Attention Notice (if limits exceeded) */}
      {exceededBudgets.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold block mb-0.5">
              Notice: {exceededBudgets.length} {exceededBudgets.length === 1 ? 'category has' : 'categories have'} exceeded their target for {currentMonth}.
            </span>
            <p className="text-[#78350F] leading-relaxed">
              Don't worry—budgets are guidelines to help you balance your expenses. Consider adjusting next week's discretionary purchases to stay comfortable.
            </p>
          </div>
        </div>
      )}

      {/* Overall Utilization Summary Card */}
      <div className="penny-card p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-medium text-[#687789]">Total budget utilization</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold text-[#24364B] font-mono">
                {currency}{totalSpent.toLocaleString()}
              </span>
              <span className="text-xs text-[#687789]">
                spent of {currency}{totalBudgeted.toLocaleString()} planned limit
              </span>
            </div>
          </div>
          <div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              overallPercentage >= 100
                ? 'bg-[#FDE8E8] text-[#9B2C2C] border-[#F8B4B4]'
                : overallPercentage >= 80
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                : 'bg-[#DDEFE4] text-[#2B6A43] border-[#B8DEC4]'
            }`}>
              {overallPercentage}% used
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#FAF9F5] rounded-full h-3 overflow-hidden p-0.5 border border-[#E6E8EC]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPercentage >= 100
                ? 'bg-[#9B2C2C]'
                : overallPercentage >= 80
                ? 'bg-[#D97706]'
                : 'bg-[#477EAD]'
            }`}
            style={{ width: `${Math.min(100, overallPercentage)}%` }}
          />
        </div>
      </div>

      {/* Category Budget Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#687789] flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-[#477EAD] border-t-transparent rounded-full animate-spin" />
          <span>Reviewing category progress...</span>
        </div>
      ) : budgets.length === 0 ? (
        <div className="penny-card p-12 text-center bg-white">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F3FF] text-[#477EAD] flex items-center justify-center mx-auto mb-3">
            <PiggyBank className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-sm font-bold text-[#24364B] mb-1">No category budgets for {currentMonth}</h3>
          <p className="text-xs text-[#687789] mb-4 max-w-sm mx-auto">
            Setting a budget gives you clear boundaries for groceries, dining, or bills without stress.
          </p>
          <button
            onClick={() => openBudgetModal(currentMonth)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-colors"
          >
            Set your first budget limit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const isExceeded = b.status === 'EXCEEDED';
            const isWarning = b.status === 'WARNING';
            const progressColor = isExceeded ? 'bg-[#9B2C2C]' : (isWarning ? 'bg-[#D97706]' : 'bg-[#477EAD]');

            return (
              <div
                key={b.id}
                className="penny-card p-5 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#24364B]">{b.category}</span>
                    <button
                      onClick={() => handleDeleteBudget(b.id, b.category)}
                      className="p-1 text-[#687789] hover:text-[#9B2C2C] rounded transition-colors"
                      title="Remove budget target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Numbers */}
                  <div className="flex items-baseline justify-between mb-2 font-mono text-xs">
                    <div>
                      <span className="text-[#687789]">Spent: </span>
                      <span className="font-bold text-[#24364B]">
                        {currency}{Number(b.spentAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[#687789]">
                      Limit: {currency}{Number(b.limitAmount).toLocaleString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#FAF9F5] rounded-full h-2 overflow-hidden border border-[#E6E8EC] mb-2.5">
                    <div
                      className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                    />
                  </div>

                  {/* Percentage & Remaining */}
                  <div className="flex items-center justify-between text-[11px] text-[#687789] mb-3">
                    <span>{b.percentageUsed}% of target</span>
                    <span className="font-medium">
                      {isExceeded ? (
                        <span className="text-[#9B2C2C]">
                          +{currency}{Number(Math.abs(b.remainingAmount)).toLocaleString()} over limit
                        </span>
                      ) : (
                        <span className="text-[#2B6A43]">
                          {currency}{Number(b.remainingAmount).toLocaleString()} remaining
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Status Indicator Note */}
                <div className={`p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${
                  isExceeded
                    ? 'bg-[#FDE8E8] text-[#9B2C2C] border border-[#F8B4B4]'
                    : isWarning
                    ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                    : 'bg-[#DDEFE4] text-[#2B6A43] border-[#B8DEC4]'
                }`}>
                  {isExceeded ? (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="truncate">{b.alertMessage}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
