import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
}

interface Activity {
  id: string;
  type: 'created' | 'resolved' | 'user' | 'assigned';
  message: string;
  time: string;
}

const StatCard = ({
  label, value, icon, color, bg,
}: {
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

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0, openTickets: 0, inProgressTickets: 0, resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  const activities: Activity[] = [
    { id: '1', type: 'created', message: 'New ticket created — Cannot access email system', time: '5 min ago' },
    { id: '2', type: 'resolved', message: 'Ticket #TN-123 has been resolved', time: '1 hour ago' },
    { id: '3', type: 'user', message: 'New user registered — Jane Smith', time: '3 hours ago' },
    { id: '4', type: 'assigned', message: 'Ticket #TN-119 assigned to IT Support', time: '5 hours ago' },
    { id: '5', type: 'created', message: 'New ticket created — Printer not working', time: 'Yesterday' },
  ];

  const activityIcons: Record<Activity['type'], { icon: React.ReactNode; bg: string; text: string }> = {
    created: { icon: '🎫', bg: 'bg-blue-50', text: 'text-blue-600' },
    resolved: { icon: '✅', bg: 'bg-green-50', text: 'text-green-600' },
    user: { icon: '👤', bg: 'bg-purple-50', text: 'text-purple-600' },
    assigned: { icon: '🔧', bg: 'bg-orange-50', text: 'text-orange-600' },
  };

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      setStats({ totalTickets: 156, openTickets: 23, inProgressTickets: 45, resolvedTickets: 88 });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const resolvedPct = stats.totalTickets > 0
    ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.firstName ?? user?.email?.split('@')[0] ?? 'there'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your tickets today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Tickets" value={stats.totalTickets} icon="📊" color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Open" value={stats.openTickets} icon="🎫" color="text-red-600" bg="bg-red-50" />
        <StatCard label="In Progress" value={stats.inProgressTickets} icon="⚙️" color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard label="Resolved" value={stats.resolvedTickets} icon="✅" color="text-green-600" bg="bg-green-50" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/tickets')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((a) => {
              const { icon, bg, text } = activityIcons[a.type];
              return (
                <div key={a.id} className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-sm`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium leading-snug">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
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
                <p className="text-xl font-bold text-green-700">{stats.resolvedTickets}</p>
                <p className="text-xs text-green-600">Resolved</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-700">{stats.openTickets}</p>
                <p className="text-xs text-red-600">Open</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Create New Ticket', path: '/tickets/new', icon: '➕', primary: true },
                { label: 'View All Tickets', path: '/tickets', icon: '📋', primary: false },
                { label: 'Manage Departments', path: '/departments', icon: '🏢', primary: false },
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
