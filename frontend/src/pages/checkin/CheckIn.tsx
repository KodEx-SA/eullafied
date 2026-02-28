import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'office' | 'site' | 'remote';
  activeStaff: number;
  capacity: number;
}

interface CheckedInStaff {
  id: string;
  name: string;
  role: string;
  location: string;
  checkedInAt: string;
  avatar: string;
  status: 'on-site' | 'break' | 'responding';
}

interface Assignment {
  id: string;
  ticket: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  eta: string;
}

const locations: Location[] = [
  { id: '1', name: 'Head Office - IT Hub',     address: '12 Main St, Rustenburg',      type: 'office', activeStaff: 4, capacity: 10 },
  { id: '2', name: 'Branch A - Finance Floor', address: '45 Nelson Mandela Dr, Joburg', type: 'office', activeStaff: 2, capacity: 6  },
  { id: '3', name: 'Data Centre - Server Room', address: '7 Tech Park, Centurion',      type: 'site',   activeStaff: 1, capacity: 4  },
  { id: '4', name: 'Remote / Work from Home',  address: 'Virtual',                      type: 'remote', activeStaff: 3, capacity: 99 },
];

const checkedInStaff: CheckedInStaff[] = [
  { id: '1', name: 'Jane Smith',  role: 'Senior Technician', location: 'Head Office - IT Hub', checkedInAt: '08:05', avatar: 'JS', status: 'responding' },
  { id: '2', name: 'John Doe',    role: 'IT Support',        location: 'Head Office - IT Hub', checkedInAt: '08:22', avatar: 'JD', status: 'on-site' },
  { id: '3', name: 'Alice Brown', role: 'Network Admin',     location: 'Data Centre',          checkedInAt: '09:01', avatar: 'AB', status: 'on-site' },
  { id: '4', name: 'Mike Davis',  role: 'IT Support',        location: 'Remote',               checkedInAt: '08:45', avatar: 'MD', status: 'break' },
];

const assignments: Assignment[] = [
  { id: '1', ticket: 'TN-001', title: 'Email server down',    priority: 'High',   location: 'Head Office - IT Hub',     eta: '10:30' },
  { id: '2', ticket: 'TN-004', title: 'VPN connectivity',     priority: 'High',   location: 'Branch A - Finance Floor', eta: '11:15' },
  { id: '3', ticket: 'TN-007', title: 'Printer setup request', priority: 'Medium', location: 'Head Office - IT Hub',    eta: '14:00' },
];

const typeStyles: Record<string, { bg: string; text: string; icon: string }> = {
  office: { bg: 'bg-blue-50',   text: 'text-blue-700',  icon: '🏢' },
  site:   { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🔧' },
  remote: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🏠' },
};

const statusStyles: Record<string, { dot: string; label: string; text: string }> = {
  'on-site':   { dot: 'bg-emerald-400', label: 'On Site',    text: 'text-emerald-600' },
  'break':     { dot: 'bg-yellow-400',  label: 'On Break',   text: 'text-yellow-600' },
  'responding':{ dot: 'bg-blue-400',    label: 'Responding', text: 'text-blue-600' },
};

const priorityStyles: Record<string, string> = {
  High:   'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low:    'bg-blue-100 text-blue-700',
};

export const CheckIn = () => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [myStatus, setMyStatus] = useState<'on-site' | 'break' | 'responding'>('on-site');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (!selectedLocation) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const now = new Date();
    setCheckInTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    setIsCheckedIn(true);
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsCheckedIn(false);
    setSelectedLocation(null);
    setCheckInTime('');
    setNotes('');
    setLoading(false);
  };

  const locObj = locations.find(l => l.id === selectedLocation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Check-In</h1>
        <p className="text-gray-500 text-sm mt-1">Sign in to your work location and view your active assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — check-in panel */}
        <div className="lg:col-span-1 space-y-5">

          {/* My status card */}
          <div className={`rounded-2xl shadow-sm border p-6 transition-all ${
            isCheckedIn ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-500 text-xs">{user?.role?.name}</p>
              </div>
            </div>

            {isCheckedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 font-semibold text-sm">Checked in</span>
                  <span className="text-gray-400 text-xs">since {checkInTime}</span>
                </div>
                <p className="text-sm text-gray-600">📍 {locObj?.name}</p>

                {/* Status selector */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">My Status</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['on-site', 'break', 'responding'] as const).map(s => (
                      <button key={s} onClick={() => setMyStatus(s)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                          myStatus === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}>
                        {statusStyles[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleCheckOut} disabled={loading}
                  className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
                  {loading ? 'Checking out...' : '📤 Check Out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span className="text-gray-500 text-sm">Not checked in</span>
              </div>
            )}
          </div>

          {/* Check-in form */}
          {!isCheckedIn && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Check In to Location</h2>

              <div className="space-y-2 mb-4">
                {locations.map(loc => {
                  const style = typeStyles[loc.type];
                  const pct = Math.round((loc.activeStaff / loc.capacity) * 100);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                        selectedLocation === loc.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg flex-shrink-0">{style.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">{loc.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{loc.address}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{loc.activeStaff}/{loc.capacity}</span>
                          </div>
                        </div>
                        {selectedLocation === loc.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Any notes for today..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <button onClick={handleCheckIn} disabled={!selectedLocation || loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Checking in...</>
                  : '📍 Check In Now'}
              </button>
            </div>
          )}

          {/* My Assignments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">My Assignments</h2>
            {assignments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No active assignments</p>
            ) : (
              <div className="space-y-3">
                {assignments.map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600">{a.ticket}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityStyles[a.priority]}`}>{a.priority}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{a.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span>📍 {a.location}</span>
                      <span>⏰ ETA {a.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — live board */}
        <div className="lg:col-span-2 space-y-5">
          {/* Location overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Location Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map(loc => {
                const style = typeStyles[loc.type];
                const pct = Math.round((loc.activeStaff / loc.capacity) * 100);
                return (
                  <div key={loc.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{loc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{loc.address}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${loc.type === 'remote' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0 font-medium">{loc.activeStaff} active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live staff board */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Live Staff Board</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                    <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Since</th>
                    <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {checkedInStaff.map(s => {
                    const st = statusStyles[s.status];
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {s.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-sm text-gray-600 truncate max-w-[140px]">{s.location}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-sm text-gray-500">{s.checkedInAt}</p>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                            <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
