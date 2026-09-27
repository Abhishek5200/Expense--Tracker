import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    monthlyBudget: user?.monthlyBudget || 0,
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      const { data } = await api.put('/auth/me', form);
      updateUser(data.user);
      setStatus('saved');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Settings</h1>
        <p className="text-sm text-ink-light mt-1">Manage your profile and budget.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {status === 'saved' && (
          <p className="text-sm text-sage bg-sage/10 border border-sage/20 rounded-lg px-3 py-2">
            Changes saved.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-brick bg-brick/10 border border-brick/20 rounded-lg px-3 py-2">
            Could not save changes.
          </p>
        )}

        <div>
          <label className="label block mb-1.5">Email</label>
          <input className="input-field opacity-60" value={user?.email || ''} disabled />
        </div>

        <div>
          <label className="label block mb-1.5">Full name</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="label block mb-1.5">Monthly budget</label>
          <input
            type="number"
            min="0"
            className="input-field font-mono"
            value={form.monthlyBudget}
            onChange={(e) => setForm({ ...form, monthlyBudget: Number(e.target.value) })}
          />
          <p className="text-xs text-ink-light mt-1">
            Set to 0 to hide the budget bar on your dashboard.
          </p>
        </div>

        <div>
          <label className="label block mb-1.5">Role</label>
          <input className="input-field opacity-60 capitalize" value={user?.role || ''} disabled />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}