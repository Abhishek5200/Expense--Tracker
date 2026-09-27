import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS, formatCurrency } from '../utils/constants.js';

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 h-full flex items-center justify-center">
        <p className="text-sm text-ink-light">No spending recorded yet</p>
      </div>
    );
  }

  return (
    <div className="card p-6 h-full">
      <p className="label mb-4">Spending by category</p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="_id"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="#1a1a1a"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry._id} fill={CATEGORY_COLORS[entry._id] || '#A6A28C'} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full sm:w-1/2 space-y-2">
          {data.slice(0, 6).map((entry) => (
            <li key={entry._id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink-light truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[entry._id] || '#A6A28C' }}
                />
                {entry._id}
              </span>
              <span className="font-mono tabular-nums text-ink-light">{formatCurrency(entry.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
