import { useState } from 'react';

type Period = '7d' | '30d' | '90d';

const Bar = ({ pct, color }: { pct: number; color: string }) => (
  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
    <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
  </div>
);

const StatCard = ({ label, value, change, changeUp, icon, color, bg }:
  { label: string; value: string | number; change: string; changeUp: boolean; icon: string; color: string; bg: string }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg`}>{icon}</div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${changeUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {changeUp ? '↑' : '↓'} {change}
      </span>
    </div>
    <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-500 text-sm mt-0.5">{label}</p>
  </div>
);

// Tiny inline SVG bar chart
const MiniBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full ${color} rounded-sm transition-all duration-500`}
            style={{ height: `${(v / max) * 56}px` }}
          />
        </div>
      ))}
    </div>
  );
};

const periodData: Record<Period, {
  stats: { totalTickets: number; resolved: number; avgTime: string; satisfaction: number };
  byStatus: { label: string; count: number; pct: number; color: string; bar: string }[];
  byPriority: { label: string; count: number; pct: number; color: string; bar: string }[];
  byDept: { name: string; tickets: number; resolved: number; pct: number }[];
  trend: number[];
  trendLabels: string[];
  topAgents: { name: string; resolved: number; rating: number; avatar: string }[];
}> = {
  '7d': {
    stats: { totalTickets: 42, resolved: 31, avgTime: '3.2h', satisfaction: 94 },
    byStatus: [
      { label: 'Resolved',    count: 31, pct: 74, color: 'text-green-600',  bar: 'bg-green-500' },
      { label: 'In Progress', count: 7,  pct: 17, color: 'text-yellow-600', bar: 'bg-yellow-400' },
      { label: 'Open',        count: 4,  pct: 9,  color: 'text-red-600',    bar: 'bg-red-500' },
    ],
    byPriority: [
      { label: 'High',   count: 12, pct: 29, color: 'text-red-600',    bar: 'bg-red-500' },
      { label: 'Medium', count: 20, pct: 48, color: 'text-yellow-600', bar: 'bg-yellow-400' },
      { label: 'Low',    count: 10, pct: 23, color: 'text-blue-600',   bar: 'bg-blue-500' },
    ],
    byDept: [
      { name: 'IT',         tickets: 18, resolved: 15, pct: 83 },
      { name: 'HR',         tickets: 10, resolved: 7,  pct: 70 },
      { name: 'Finance',    tickets: 8,  resolved: 6,  pct: 75 },
      { name: 'Operations', tickets: 6,  resolved: 3,  pct: 50 },
    ],
    trend: [5, 8, 4, 7, 9, 6, 3],
    trendLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    topAgents: [
      { name: 'Jane Smith', resolved: 12, rating: 4.9, avatar: 'JS' },
      { name: 'John Doe',   resolved: 10, rating: 4.7, avatar: 'JD' },
      { name: 'Admin User', resolved: 9,  rating: 4.8, avatar: 'AU' },
    ],
  },
  '30d': {
    stats: { totalTickets: 156, resolved: 120, avgTime: '4.1h', satisfaction: 91 },
    byStatus: [
      { label: 'Resolved',    count: 120, pct: 77, color: 'text-green-600',  bar: 'bg-green-500' },
      { label: 'In Progress', count: 23,  pct: 15, color: 'text-yellow-600', bar: 'bg-yellow-400' },
      { label: 'Open',        count: 13,  pct: 8,  color: 'text-red-600',    bar: 'bg-red-500' },
    ],
    byPriority: [
      { label: 'High',   count: 42, pct: 27, color: 'text-red-600',    bar: 'bg-red-500' },
      { label: 'Medium', count: 78, pct: 50, color: 'text-yellow-600', bar: 'bg-yellow-400' },
      { label: 'Low',    count: 36, pct: 23, color: 'text-blue-600',   bar: 'bg-blue-500' },
    ],
    byDept: [
      { name: 'IT',         tickets: 65, resolved: 54, pct: 83 },
      { name: 'HR',         tickets: 38, resolved: 29, pct: 76 },
      { name: 'Finance',    tickets: 31, resolved: 24, pct: 77 },
      { name: 'Operations', tickets: 22, resolved: 13, pct: 59 },
    ],
    trend: [12, 18, 14, 22, 17, 19, 15, 21, 16, 20, 13, 17, 19, 22, 18, 14, 20, 16, 23, 18, 15, 19, 21, 14, 17, 22, 19, 15, 18, 20],
    trendLabels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    topAgents: [
      { name: 'Jane Smith', resolved: 48, rating: 4.9, avatar: 'JS' },
      { name: 'John Doe',   resolved: 39, rating: 4.7, avatar: 'JD' },
      { name: 'Admin User', resolved: 33, rating: 4.8, avatar: 'AU' },
    ],
  },
  '90d': {
    stats: { totalTickets: 489, resolved: 401, avgTime: '5.3h', satisfaction: 89 },
    byStatus: [
      { label: 'Resolved',    count: 401, pct: 82, color: 'text-green-600',  bar: 'bg-green-500' },
      { label: 'In Progress', count: 55,  pct: 11, color: 'text-yellow-600', bar: 'bg-yellow-400' },
      { label: 'Open',        count: 33,  pct: 7,  color: 'text-red-600',    bar: 'bg-red-500' },
    ],
    byPriority: [
      { label: 'High',   count: 120, pct: 25, color: 'text-red-600',    bar: 'bg-red-500' },
      { label: 'Medium', count: 245, pct: 50, color: 'text-yellow-600', bar: 'bg-yellow-400' },
      { label: 'Low',    count: 124, pct: 25, color: 'text-blue-600',   bar: 'bg-blue-500' },
    ],
    byDept: [
      { name: 'IT',         tickets: 201, resolved: 172, pct: 86 },
      { name: 'HR',         tickets: 118, resolved: 95,  pct: 81 },
      { name: 'Finance',    tickets: 99,  resolved: 80,  pct: 81 },
      { name: 'Operations', tickets: 71,  resolved: 54,  pct: 76 },
    ],
    trend: [45, 52, 48, 61, 55, 58, 50, 63, 57, 60, 48, 55],
    trendLabels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8','Week 9','Week 10','Week 11','Week 12'],
    topAgents: [
      { name: 'Jane Smith', resolved: 148, rating: 4.9, avatar: 'JS' },
      { name: 'John Doe',   resolved: 127, rating: 4.7, avatar: 'JD' },
      { name: 'Admin User', resolved: 126, rating: 4.8, avatar: 'AU' },
    ],
  },
};

export const Reports = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const d = periodData[period];
  const resolutionPct = Math.round((d.stats.resolved / d.stats.totalTickets) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Track performance metrics and ticket trends.</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets"    value={d.stats.totalTickets} change="12%"  changeUp={true}  icon="🎫" color="text-blue-600"   bg="bg-blue-50" />
        <StatCard label="Resolved"         value={d.stats.resolved}     change="8%"   changeUp={true}  icon="✅" color="text-green-600"  bg="bg-green-50" />
        <StatCard label="Avg. Resolution"  value={d.stats.avgTime}      change="0.3h" changeUp={false} icon="⏱️" color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Satisfaction"     value={`${d.stats.satisfaction}%`} change="2%" changeUp={true} icon="⭐" color="text-purple-600" bg="bg-purple-50" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Ticket Volume</h2>
            <span className="text-xs text-gray-400">Last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}</span>
          </div>
          <MiniBarChart data={d.trend} color="bg-blue-500" />
          <div className="flex justify-between mt-2">
            {(d.trendLabels.length <= 12 ? d.trendLabels : d.trendLabels.filter((_, i) => i % Math.ceil(d.trendLabels.length / 7) === 0)).map(l => (
              <span key={l} className="text-xs text-gray-400">{l}</span>
            ))}
          </div>
        </div>

        {/* Resolution ring */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <h2 className="text-base font-semibold text-gray-900 self-start mb-4">Resolution Rate</h2>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#2563eb" strokeWidth="12"
                strokeDasharray={`${(resolutionPct / 100) * 314} 314`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{resolutionPct}%</span>
              <span className="text-xs text-gray-400">resolved</span>
            </div>
          </div>
          <div className="mt-4 w-full space-y-1.5">
            {d.byStatus.map(s => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{s.label}</span>
                <span className={`font-semibold ${s.color}`}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* By Priority */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">By Priority</h2>
          <div className="space-y-3">
            {d.byPriority.map(p => (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{p.label}</span>
                  <span className={`text-sm font-semibold ${p.color}`}>{p.count} ({p.pct}%)</span>
                </div>
                <Bar pct={p.pct} color={p.bar} />
              </div>
            ))}
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">By Department</h2>
          <div className="space-y-3">
            {d.byDept.map(dep => (
              <div key={dep.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{dep.name}</span>
                  <span className="text-sm font-semibold text-gray-800">{dep.pct}%</span>
                </div>
                <Bar pct={dep.pct} color="bg-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Agents</h2>
          <div className="space-y-3">
            {d.topAgents.map((a, i) => (
              <div key={a.name} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-5 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.resolved} resolved</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
                  ⭐ {a.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
