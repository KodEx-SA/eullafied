import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ticketsService } from '../../services/tickets.service';
import type { Ticket } from '../../types';
import { STATUS_LABEL, PRIORITY_LABEL, ticketNumber } from '../../types';

interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

const StatCard = ({ label, value, icon, color, bg }: {
  label: string; value: number; icon: React.ReactNode; color: string; bg: string;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
      <span className={`${color} text-2xl`}>{icon}</span>
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const priorityColor: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ticketsService.getAll()
      .then((data) => {
        setTickets(data);
        setStats({
          total: data.length,
          open: data.filter(t => t.status === 'open').length,
          inProgress: data.filter(t => t.status === 'in_progress').length,
          resolved: data.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        });
      })
      .catch(() => setError('Could not load ticket data.'))
      .finally(() => setLoading(false));
  }, []);

  const resolvedPct = stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.firstName ?? 'there'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your tickets today.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Tickets"  value={stats.total}      icon="📊" color="text-blue-600"   bg="bg-blue-50" />
        <StatCard label="Open"           value={stats.open}       icon="🎫" color="text-red-600"    bg="bg-red-50" />
        <StatCard label="In Progress"    value={stats.inProgress} icon="⚙️" color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard label="Resolved"       value={stats.resolved}   icon="✅" color="text-green-600"  bg="bg-green-50" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
            <button
              onClick={() => navigate('/tickets')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </button>
          </div>

          {recentTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <span className="text-4xl mb-3">🎫</span>
              <p className="text-sm">No tickets yet — create the first one!</p>
              <button
                onClick={() => navigate('/tickets/new')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Create Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-blue-600">{ticketNumber(t.id)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityColor[t.priority]}`}>
                        {PRIORITY_LABEL[t.priority]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.createdBy.firstName} {t.createdBy.lastName} · {t.department.name}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex-shrink-0 ${
                    t.status === 'open'        ? 'bg-red-50 text-red-700' :
                    t.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' :
                    t.status === 'resolved'    ? 'bg-green-50 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Resolution Rate */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="50" fill="none" stroke="#2563eb" strokeWidth="12"
                    strokeDasharray={`${(resolvedPct / 100) * 314} 314`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{resolvedPct}%</span>
                  <span className="text-xs text-gray-400">resolved</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-green-700">{stats.resolved}</p>
                <p className="text-xs text-green-600">Resolved</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-700">{stats.open}</p>
                <p className="text-xs text-red-600">Open</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Create New Ticket',    path: '/tickets/new',  icon: '➕', primary: true },
                { label: 'View All Tickets',     path: '/tickets',      icon: '📋', primary: false },
                { label: 'Manage Departments',   path: '/departments',  icon: '🏢', primary: false },
              ].map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    action.primary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
