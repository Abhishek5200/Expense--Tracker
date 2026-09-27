import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Wallet, LayoutDashboard, Receipt, Settings as SettingsIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/8 bg-cream/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center">
            <Wallet size={16} />
          </span>
          <span className="font-display text-xl tracking-tight text-ink">Money Tracker</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `tab-pill flex items-center gap-2 ${
                  isActive ? 'tab-pill-active' : 'tab-pill-inactive'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `tab-pill flex items-center gap-2 ${
                  isActive ? 'tab-pill-active' : 'tab-pill-inactive'
                }`
              }
            >
              <ShieldCheck size={15} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-ink-light">
            {user?.name} <span className="text-gold uppercase text-xs">· {user?.role}</span>
          </span>
          <button onClick={handleLogout} className="btn-secondary flex items-center gap-1.5 text-sm">
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/8 bg-cream px-4 py-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-gold text-black' : 'text-ink-light'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-gold text-black' : 'text-ink-light'
                }`
              }
            >
              <ShieldCheck size={15} />
              Admin Panel
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brick font-medium"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </header>
  );
}
