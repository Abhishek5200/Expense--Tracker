import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants.js';

const emptyForm = {
  title: '',
  amount: '',
  category: 'Other',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'Card',
  notes: '',
};

function buildInitialForm(initial) {
  if (!initial) return emptyForm;
  return {
    title: initial.title || '',
    amount: initial.amount ?? '',
    category: initial.category || 'Other',
    type: initial.type || 'expense',
    date: initial.date ? initial.date.slice(0, 10) : emptyForm.date,
    paymentMethod: initial.paymentMethod || 'Card',
    notes: initial.notes || '',
  };
}

export default function ExpenseModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(() => buildInitialForm(initial));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || Number(form.amount) < 0) {
      setError('Please enter a title and a valid amount');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, amount: Number(form.amount) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="card-glow w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-light hover:text-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2 className="font-display text-2xl text-ink mb-5">
          {initial ? 'Edit entry' : 'New entry'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-brick bg-brick/10 border border-brick/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border capitalize transition-colors ${
                  form.type === t
                    ? t === 'expense'
                      ? 'bg-brick/10 border-brick text-brick'
                      : 'bg-sage/10 border-sage text-sage'
                    : 'border-white/10 text-ink-light'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="label block mb-1.5">Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Grocery run, freelance payment…"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field font-mono"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label block mb-1.5">Date</label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label block mb-1.5">Payment method</label>
              <select
                className="input-field"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              >
                {PAYMENT_METHODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label block mb-1.5">Notes (optional)</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : 'Save entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
