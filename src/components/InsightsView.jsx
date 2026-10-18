import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  AlertCircle, 
  Lightbulb, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  PieChart as PieIcon,
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

// Calm, cohesive chart palette from Pennywise design system
const CHART_COLORS = [
  '#477EAD', // Primary action blue
  '#BBD9F5', // Secondary blue
  '#DDEFE4', // Soft sage
  '#F8E7A1', // Butter yellow
  '#E9E5F8', // Muted lilac
  '#89A9C4', // Soft slate blue
  '#729B79', // Deep sage
  '#E6C280', // Warm amber
  '#C4B8EB'  // Soft violet
];

export const InsightsView = () => {
  const { currency, isAuthenticated } = useAuth();
  const [insights, setInsights] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsightsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [insightsRes, dashRes] = await Promise.all([
        api.get('/analytics/insights'),
        api.get('/analytics/dashboard')
      ]);
      setInsights(insightsRes.data);
      setDashboardData(dashRes.data);
    } catch (err) {
      setError('Could not load insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInsightsData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 border-2 border-[#477EAD] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#687789]">Analyzing spending patterns and estimates...</span>
      </div>
    );
  }

  const {
    spendingPatterns = [],
    anomalies = [],
    forecast = {},
    recommendations = []
  } = insights || {};

  const categoryBreakdown = dashboardData?.categoryBreakdown || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#24364B]">Insights</h1>
        <p className="text-xs text-[#687789] mt-0.5">
          Practical spending observations and estimates based on your history
        </p>
      </div>

      {/* ================================================================= */}
      {/* 1. Spending Estimate (Formerly Forecast) */}
      {/* ================================================================= */}
      <div className="penny-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E8EC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#24364B]">Spending estimate for this month</span>
              <span className="text-[10px] bg-[#E8F3FF] text-[#477EAD] px-2 py-0.5 rounded-full font-medium">
                {forecast.daysPassedInMonth} days elapsed
              </span>
            </div>
            <p className="text-xs text-[#687789] mt-0.5 leading-relaxed">
              {forecast.explanation || "Calculated based on your actual daily pace this month."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Average spent per day (formerly Daily Burn Rate) */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC]">
            <span className="text-[11px] text-[#687789] block">
              Average spent per day
            </span>
            <div className="text-lg font-bold text-[#24364B] font-mono mt-1">
              {currency}{Number(forecast.dailyBurnRate || 0).toLocaleString()}
            </div>
          </div>

          {/* Current month-to-date spent */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC]">
            <span className="text-[11px] text-[#687789] block">
              Spent so far
            </span>
            <div className="text-lg font-bold text-[#24364B] font-mono mt-1">
              {currency}{Number(forecast.currentMonthSpend || 0).toLocaleString()}
            </div>
          </div>

          {/* Estimated spending by the end of the month */}
          <div className="p-3.5 rounded-xl bg-[#E8F3FF] border border-[#BBD9F5]">
            <span className="text-[11px] text-[#477EAD] block font-medium">
              Estimated month-end total
            </span>
            <div className="text-lg font-bold text-[#24364B] font-mono mt-1">
              {currency}{Number(forecast.projectedMonthEndSpend || 0).toLocaleString()}
            </div>
          </div>

          {/* Next month estimate */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC]">
            <span className="text-[11px] text-[#687789] block">
              Next month estimate
            </span>
            <div className="text-lg font-bold text-[#24364B] font-mono mt-1">
              {currency}{Number(forecast.nextMonthForecast || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. Spending by category (Donut Chart) */}
      {/* ================================================================= */}
      <div className="penny-card p-6 bg-white">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#24364B]">Spending by category</h2>
          <p className="text-xs text-[#687789]">Distribution across your active categories</p>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-60 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6E8EC', borderRadius: '12px', fontSize: '11px', color: '#24364B' }}
                    formatter={(val) => [`${currency}${Number(val).toLocaleString()}`, 'Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown table */}
            <div className="space-y-2">
              {categoryBreakdown.map((item, idx) => (
                <div key={item.category} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-[#FAF9F5] transition-colors">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 border border-black/10" 
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} 
                    />
                    <span className="text-[#24364B] font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[#687789] text-[11px]">{item.percentage}%</span>
                    <span className="font-bold text-[#24364B]">
                      {currency}{Number(item.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#687789]">
            No categorized expenses found for this month yet.
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 3. Unusual spending & Observed spending patterns */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unusual spending (formerly Anomaly Detection) */}
        <div className="penny-card p-5 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#477EAD]" />
            <h2 className="text-sm font-bold text-[#24364B]">Unusual spending</h2>
          </div>
          <p className="text-xs text-[#687789]">
            Transactions noticeably higher than your category baseline
          </p>

          <div className="space-y-2.5 pt-1">
            {anomalies.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC] text-xs text-[#2B6A43] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2B6A43] shrink-0" />
                <span>No unusual spikes detected this month. Spending is consistent.</span>
              </div>
            ) : (
              anomalies.map((anom) => (
                <div
                  key={anom.transactionId}
                  className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#24364B]">{anom.title}</span>
                    <span className="font-mono font-bold text-[#24364B]">
                      {currency}{Number(anom.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#687789] flex items-center gap-2">
                    <span className="bg-white px-1.5 py-0.2 rounded border border-[#E6E8EC]">
                      {anom.category}
                    </span>
                    <span>•</span>
                    <span>{anom.date}</span>
                    <span>•</span>
                    <span className="text-[#477EAD] font-medium">{anom.multiplier}x usual baseline</span>
                  </div>
                  <p className="text-[11px] text-[#687789] pt-0.5">
                    {anom.explanation}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Observed patterns */}
        <div className="penny-card p-5 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#477EAD]" />
            <h2 className="text-sm font-bold text-[#24364B]">Observed patterns</h2>
          </div>
          <p className="text-xs text-[#687789]">
            Habits and rhythms identified from your transaction dates and methods
          </p>

          <div className="space-y-2.5 pt-1">
            {spendingPatterns.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC] text-xs text-[#687789]">
                More records are needed to detect weekend versus weekday habits.
              </div>
            ) : (
              spendingPatterns.map((pat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC] text-xs text-[#24364B] leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#477EAD] shrink-0 mt-1.5" />
                  <span>{pat}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. Actionable Recommendations */}
      {/* ================================================================= */}
      <div className="penny-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#D97706]" />
          <div>
            <h2 className="text-sm font-bold text-[#24364B]">Helpful suggestions</h2>
            <p className="text-xs text-[#687789]">Practical adjustments based on your spending distribution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#24364B]">{rec.title}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white border border-[#E6E8EC] text-[#687789]">
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-[#687789] leading-relaxed mb-2">{rec.description}</p>
                <div className="p-2.5 rounded-lg bg-white border border-[#E6E8EC] text-[11px] text-[#24364B]">
                  💡 <span className="font-medium">Action:</span> {rec.actionSuggestion}
                </div>
              </div>

              {Number(rec.potentialMonthlySavings) > 0 && (
                <div className="pt-2 border-t border-[#E6E8EC] flex items-center justify-between text-xs">
                  <span className="text-[#687789]">Estimated monthly savings:</span>
                  <span className="font-mono font-bold text-[#2B6A43]">
                    +{currency}{Number(rec.potentialMonthlySavings).toLocaleString()}/mo
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
