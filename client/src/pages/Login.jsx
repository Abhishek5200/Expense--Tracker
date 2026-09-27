import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  PieChart,
  TrendingUp,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to sign in. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-cream relative overflow-hidden text-ink">

        {/* Background decoration */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative z-10 w-full px-16 py-14 flex flex-col">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold text-black flex items-center justify-center">
              <Wallet size={23} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Money <span className="text-gold">Tracker</span>
            </h1>
          </div>

          {/* Hero */}
          <div className="mt-24 max-w-xl">

            <p className="text-gold font-semibold tracking-wide uppercase text-sm mb-5">
              Smart financial management
            </p>

            <h2 className="text-5xl xl:text-6xl font-bold leading-tight">
              Take control of
              <br />
              your <span className="text-gold">finances.</span>
            </h2>

            <p className="mt-6 text-ink-light text-lg leading-relaxed max-w-md">
              Track your expenses, understand your spending habits,
              manage your budget and work towards your financial goals.
            </p>

            {/* Features */}
            <div className="mt-12 space-y-6">

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <PieChart size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-ink">Track Expenses</h3>
                  <p className="text-sm text-ink-light mt-1">
                    Monitor where your money goes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <TrendingUp size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-ink">Smart Insights</h3>
                  <p className="text-sm text-ink-light mt-1">
                    Understand your spending patterns.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Target size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-ink">Achieve Goals</h3>
                  <p className="text-sm text-ink-light mt-1">
                    Build better saving habits.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Mini dashboard cards */}
          <div className="relative mt-auto h-40">

            <div className="absolute left-5 bottom-0 card-glow p-5 w-56 rotate-[-3deg]">
              <p className="text-xs text-ink-light">Monthly spending</p>

              <p className="text-xl font-bold text-ink mt-2">
                ₹24,280
              </p>

              <div className="flex items-end gap-1 mt-4 h-10">
                <div className="w-3 h-4 bg-gold rounded-sm" />
                <div className="w-3 h-7 bg-gold rounded-sm" />
                <div className="w-3 h-5 bg-gold rounded-sm" />
                <div className="w-3 h-9 bg-gold rounded-sm" />
                <div className="w-3 h-6 bg-gold rounded-sm" />
                <div className="w-3 h-10 bg-gold rounded-sm" />
              </div>
            </div>

            <div className="absolute left-64 bottom-5 card-glow p-5 w-52 rotate-[3deg]">
              <p className="text-xs text-ink-light">
                Savings goal
              </p>

              <p className="text-lg font-bold text-ink mt-2">
                ₹12,000 / ₹20,000
              </p>

              <div className="mt-4 h-2 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gold rounded-full" />
              </div>

              <p className="text-xs text-ink-light mt-2">
                60% completed
              </p>
            </div>

          </div>

        </div>
      </div>


      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center">
              <Wallet size={23} />
            </div>

            <h1 className="text-2xl font-bold text-ink">
              Money <span className="text-gold">Tracker</span>
            </h1>
          </div>


          {/* Card */}
          <div className="card px-7 sm:px-10 py-9">

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Wallet size={28} />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mt-5">
              <h2 className="text-3xl font-bold text-ink">
                Welcome back
              </h2>

              <p className="text-ink-light mt-2">
                Sign in to continue managing your finances
              </p>
            </div>


            {/* Error */}
            {error && (
              <div className="mt-6 px-4 py-3 rounded-xl bg-brick/10 border border-brick/20 text-brick text-sm">
                {error}
              </div>
            )}


            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light"
                  />

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }
                    placeholder="you@example.com"
                    className="w-full h-13 pl-12 pr-4 rounded-xl border border-white/10 bg-cream text-ink placeholder:text-ink-light/60 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
                  />
                </div>
              </div>


              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-ink">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-gold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value
                      })
                    }
                    placeholder="Enter your password"
                    className="w-full h-13 pl-12 pr-12 rounded-xl border border-white/10 bg-cream text-ink placeholder:text-ink-light/60 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>


              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-xl bg-gold text-black font-semibold shadow-lg shadow-gold/20 transition hover:bg-gold-light hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

            </form>


            {/* Register */}
            <p className="text-center text-sm text-ink-light mt-7">
              Don't have an account?{' '}

              <Link
                to="/register"
                className="text-gold font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>

          </div>

          {/* Footer */}
          <p className="text-center text-xs text-ink-light mt-6">
            Your finances, organized. Your future, brighter.
          </p>

        </div>
      </div>

    </div>
  );
}
