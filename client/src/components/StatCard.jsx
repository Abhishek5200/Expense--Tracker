import { formatCurrency } from '../utils/constants.js';

export default function StatCard({ label, value, tone = 'ink', hint }) {
  const toneClasses = {
    ink: 'text-ink',
    brick: 'text-brick',
    sage: 'text-sage',
    gold: 'text-gold',
  };

  return (
    <div className="card p-5">
      <p className="label mb-2">{label}</p>
      <p className={`font-mono text-2xl sm:text-3xl font-medium tabular-nums ${toneClasses[tone]}`}>
        {formatCurrency(value)}
      </p>
      {hint && <p className="text-xs text-ink-light mt-1">{hint}</p>}
    </div>
  );
}
