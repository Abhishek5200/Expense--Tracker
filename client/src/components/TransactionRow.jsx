import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { CATEGORY_COLORS, formatCurrency } from '../utils/constants.js';

export default function TransactionRow({ expense, onEdit, onDelete }) {
  const isIncome = expense.type === 'income';

  return (
    <div className="group flex items-center gap-4 py-3 px-2 border-b border-white/6 hover:bg-white/[0.03] transition-colors rounded-lg">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#A6A28C' }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{expense.title}</p>
        <p className="text-xs text-ink-light">
          {expense.category} · {format(new Date(expense.date), 'MMM d, yyyy')} · {expense.paymentMethod}
        </p>
      </div>

      <p className={`figure text-sm font-medium shrink-0 ${isIncome ? 'text-sage' : 'text-brick'}`}>
        {isIncome ? '+' : '−'}
        {formatCurrency(expense.amount)}
      </p>

      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(expense)}
          className="p-1.5 text-ink-light hover:text-ink hover:bg-white/5 rounded-lg"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(expense)}
          className="p-1.5 text-ink-light hover:text-brick hover:bg-brick/10 rounded-lg"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex sm:hidden items-center gap-1 shrink-0">
        <button onClick={() => onEdit(expense)} className="p-1.5 text-ink-light" aria-label="Edit">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(expense)} className="p-1.5 text-brick" aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
