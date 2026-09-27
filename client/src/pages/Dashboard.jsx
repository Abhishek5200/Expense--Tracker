import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/StatCard.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import TrendChart from '../components/TrendChart.jsx';
import TransactionRow from '../components/TransactionRow.jsx';
import ExpenseModal from '../components/ExpenseModal.jsx';
import { formatCurrency } from '../utils/constants.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [summaryRes, recentRes] = await Promise.all([
      api.get('/expenses/summary'),
      api.get('/expenses', { params: { limit: 6, sortBy: 'date', sortOrder: 'desc' } }),
    ]);
    setSummary(summaryRes.data);
    setRecent(recentRes.data.items);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleSave = async (data) => {
    if (editing) {
      await api.put(`/expenses/${editing._id}`, data);
    } else {
      await api.post('/expenses', data);
    }
    setEditing(null);
    await load();
  };

  const handleEdit = (expense) => {
    setEditing(expense);
    setModalOpen(true);
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete "${expense.title}"?`)) return;
    await api.delete(`/expenses/${expense._id}`);
    await load();
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const budget = user?.monthlyBudget || 0;
  const spentPct = budget > 0 ? Math.min(100, Math.round(((summary?.expense || 0) / budget) * 100)) : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="label mb-1">Personal Finance</p>
          <h1 className="font-display text-3xl text-ink">Overview</h1>
          <p className="text-sm text-ink-light mt-1">Every entry, tallied and totaled.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New entry
        </button>
      </div>

      {loading ? (
        <p className="label">Tallying the books…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total income" value={summary?.income} tone="sage" />
            <StatCard label="Total expenses" value={summary?.expense} tone="brick" />
            <StatCard
              label="Net balance"
              value={summary?.balance}
              tone={summary?.balance >= 0 ? 'ink' : 'brick'}
            />
          </div>

          {budget > 0 && (
            <div className="card-glow p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="label">Monthly budget</p>
                <p className="text-xs text-ink-light font-mono">
                  {formatCurrency(summary?.expense)} / {formatCurrency(budget)}
                </p>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${spentPct >= 100 ? 'bg-brick' : 'bg-gold'}`}
                  style={{ width: `${spentPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryChart data={summary?.byCategory} />
            <TrendChart byMonth={summary?.byMonth} />
          </div>

          <div className="card">
            <div className="flex items-center justify-between px-5 pt-5">
              <p className="label">Recent activity</p>
            </div>
            <div className="px-3 pb-2 mt-2">
              {recent.length === 0 ? (
                <p className="text-sm text-ink-light px-2 py-6 text-center">
                  No entries yet — add your first one above.
                </p>
              ) : (
                recent.map((exp) => (
                  <TransactionRow
                    key={exp._id}
                    expense={exp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <ExpenseModal
          key={editing?._id || 'new'}
          onClose={closeModal}
          onSave={handleSave}
          initial={editing}
        />
      )}
    </div>
  );
}