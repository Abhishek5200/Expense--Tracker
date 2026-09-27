import { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  WalletCards,
  Eye,
  X,
  RefreshCw,
  Mail,
  CalendarDays
} from 'lucide-react';

import api from '../api/axios.js';
import { formatCurrency } from '../utils/constants.js';

import './AdminPanel.css';

export default function AdminPanel() {

  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userExpenses, setUserExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAdminData = useCallback(async () => {
    setError('');

    try {

      const [overviewRes, usersRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users')
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data.users || []);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Unable to load admin data.'
      );

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAdminData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadAdminData]);

  const openUser = async (user) => {

    setSelectedUser(user);
    setDetailLoading(true);

    try {

      const res = await api.get(
        `/admin/users/${user._id}/expenses`
      );

      setUserExpenses(res.data.expenses || []);

    } catch (err) {

      setUserExpenses([]);

      setError(
        err.response?.data?.message ||
        'Unable to load user transactions.'
      );

    } finally {

      setDetailLoading(false);

    }
  };

  const closeUser = () => {
    setSelectedUser(null);
    setUserExpenses([]);
  };

  if (loading) {

    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner" />
          Loading admin overview...
        </div>
      </div>
    );

  }

  const income = overview?.totalIncome || 0;
  const expense = overview?.totalExpense || 0;
  const balance = income - expense;

  return (

    <div className="admin-page">

      <div className="admin-shell">

        {/* HEADER */}

        <header className="admin-hero">

          <div>

            <div className="admin-eyebrow">
              <ShieldCheck size={15} />
              ADMIN CONTROL CENTER
            </div>

            <h1>Admin Panel</h1>

            <p>
              Manage users and review platform-wide financial activity.
            </p>

          </div>

          <button
            className="admin-refresh"
            onClick={loadAdminData}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </header>


        {/* ERROR */}

        {error && (
          <div className="admin-alert">
            {error}
          </div>
        )}


        {/* STAT CARDS */}

        <section className="admin-stats">

          <div className="admin-stat">

            <div className="admin-stat-top">
              <span>Total Users</span>

              <div className="admin-stat-icon">
                <Users size={18} />
              </div>
            </div>

            <strong>
              {overview?.totalUsers || 0}
            </strong>

            <small>
              Registered accounts
            </small>

          </div>


          <div className="admin-stat income">

            <div className="admin-stat-top">
              <span>Total Income</span>

              <div className="admin-stat-icon">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <strong>
              {formatCurrency(income)}
            </strong>

            <small>
              Across all users
            </small>

          </div>


          <div className="admin-stat expense">

            <div className="admin-stat-top">
              <span>Total Expenses</span>

              <div className="admin-stat-icon">
                <ArrowDownRight size={18} />
              </div>
            </div>

            <strong>
              {formatCurrency(expense)}
            </strong>

            <small>
              Across all users
            </small>

          </div>


          <div className="admin-stat balance">

            <div className="admin-stat-top">
              <span>Platform Balance</span>

              <div className="admin-stat-icon">
                <WalletCards size={18} />
              </div>
            </div>

            <strong>
              {formatCurrency(balance)}
            </strong>

            <small>
              Income minus expenses
            </small>

          </div>

        </section>


        {/* USERS */}

        <section className="admin-panel-card">

          <div className="admin-card-head">

            <div>

              <span className="admin-kicker">
                USER MANAGEMENT
              </span>

              <h2>
                All Users
              </h2>

            </div>

            <span className="admin-count">
              {users.length} accounts
            </span>

          </div>


          <div className="admin-table-wrap">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Transactions</th>
                  <th>Joined</th>
                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {users.map((item) => (

                  <tr key={item._id}>

                    <td>

                      <div className="admin-user-cell">

                        <div className="admin-avatar">
                          {(item.name || '?')
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {item.name}
                        </strong>

                      </div>

                    </td>


                    <td>

                      <span className="admin-email">

                        <Mail size={13} />

                        {item.email}

                      </span>

                    </td>


                    <td>

                      <span
                        className={`role-badge ${item.role}`}
                      >
                        {item.role}
                      </span>

                    </td>


                    <td>
                      {item.transactionCount || 0}
                    </td>


                    <td>

                      <span className="admin-date">

                        <CalendarDays size={13} />

                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString(
                              'en-IN'
                            )
                          : '—'}

                      </span>

                    </td>


                    <td>

                      <button
                        className="view-user-btn"
                        onClick={() => openUser(item)}
                      >
                        <Eye size={15} />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>


      {/* USER DETAILS */}

      {selectedUser && (

        <div
          className="user-detail-backdrop"
          onClick={closeUser}
        >

          <aside
            className="user-detail-panel"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="user-detail-head">

              <div>

                <span className="admin-kicker">
                  USER DETAILS
                </span>

                <h2>
                  {selectedUser.name}
                </h2>

                <p>
                  {selectedUser.email}
                </p>

              </div>


              <button
                className="detail-close"
                onClick={closeUser}
              >
                <X size={18} />
              </button>

            </div>


            <div className="detail-summary">

              <div>

                <span>Role</span>

                <strong>
                  {selectedUser.role}
                </strong>

              </div>


              <div>

                <span>Transactions</span>

                <strong>
                  {selectedUser.transactionCount || 0}
                </strong>

              </div>

            </div>


            <div className="detail-transactions">

              <div className="detail-section-title">

                <span>
                  TRANSACTIONS
                </span>

                <span>
                  {userExpenses.length}
                </span>

              </div>


              {detailLoading ? (

                <div className="detail-loading">
                  Loading transactions...
                </div>

              ) : userExpenses.length === 0 ? (

                <div className="detail-empty">
                  No transactions for this user.
                </div>

              ) : (

                userExpenses.map((transaction) => (

                  <div
                    className="admin-transaction"
                    key={transaction._id}
                  >

                    <div>

                      <strong>
                        {transaction.title}
                      </strong>

                      <span>
                        {transaction.category || 'Other'}
                      </span>

                    </div>


                    <strong
                      className={
                        transaction.type === 'income'
                          ? 'transaction-income'
                          : 'transaction-expense'
                      }
                    >

                      {transaction.type === 'income'
                        ? '+'
                        : '−'}

                      {formatCurrency(
                        transaction.amount
                      )}

                    </strong>

                  </div>

                ))

              )}

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}