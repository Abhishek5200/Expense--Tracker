import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/constants.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TrendChart({ byMonth }) {
  const data = useMemo(() => {
    const map = {};
    (byMonth || []).forEach(({ _id, total }) => {
      const key = `${_id.year}-${_id.month}`;
      if (!map[key]) map[key] = { key, label: `${MONTHS[_id.month - 1]} '${String(_id.year).slice(2)}`, income: 0, expense: 0 };
      map[key][_id.type] = total;
    });
    return Object.values(map).sort((a, b) => (a.key > b.key ? 1 : -1)).slice(-6);
  }, [byMonth]);

  if (data.length === 0) {
    return (
      <div className="card p-6 h-full flex items-center justify-center">
        <p className="text-sm text-ink-light">No trend data yet</p>
      </div>
    );
  }

  return (
    <div className="card p-6 h-full">
      <p className="label mb-4">Income vs. expense, last 6 months</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#a3a3a0', fontFamily: 'Arial' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#a3a3a0', fontFamily: 'Arial' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontFamily: 'Arial, sans-serif',
                fontSize: 13,
                color: '#f2f2f0',
              }}
            />
            <Bar dataKey="income" fill="#6ee7b7" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-3 text-xs text-ink-light">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sage" /> Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brick" /> Expense
        </span>
      </div>
    </div>
  );
}
