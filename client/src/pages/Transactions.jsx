import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios.js';
import TransactionRow from '../components/TransactionRow.jsx';
import ExpenseModal from '../components/ExpenseModal.jsx';
import { CATEGORIES } from '../utils/constants.js';

const emptyFilters = {
  q: '',
  category: '',
  type: '',
  startDate: '',
  endDate: '',
};

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    
    setLoading(true);
    try {
      const params = { page, limit: 10, sortBy: 'date', sortOrder: 'desc' };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const { data } = await api.get('/expenses', { params });
      setItems(data.items);
      setPages(data.pages);
      setTotal(data.total);
    } finally {
      
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

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

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Transactions</h1>
          <p className="text-sm text-ink-light mt-1">{total} entries recorded</p>
        </div>
        <button onClick={handleNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> New entry
        </button>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              className="input-field pl-9"
              placeholder="Search by title or notes…"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`btn-secondary flex items-center gap-1.5 shrink-0 ${
              activeFilterCount > 0 ? 'bg-gold/10 border-gold text-gold' : ''
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <select
              className="input-field text-sm"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="input-field text-sm"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Income & expense</option>
              <option value="expense">Expense only</option>
              <option value="income">Income only</option>
            </select>
            <input
              type="date"
              className="input-field text-sm"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <input
              type="date"
              className="input-field text-sm"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilters(emptyFilters);
                  setPage(1);
                }}
                className="col-span-2 sm:col-span-4 text-xs text-brick text-left hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card">
        {loading ? (
          <p className="text-sm text-ink-light px-5 py-8 text-center">Loading entries…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-light px-5 py-8 text-center">
            No entries match these filters.
          </p>
        ) : (
          <div className="px-3">
            {items.map((exp) => (
              <TransactionRow key={exp._id} expense={exp} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/8">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-ink-light font-mono">
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

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