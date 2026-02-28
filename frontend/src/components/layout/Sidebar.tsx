import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── ETS Logo mark ─────────────────────────────────────────────────────────────
const ETSMark = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
  </svg>
);

const navGroups = [
  {
    label: 'Workspace',
    roles: ['ALL'],
    items: [
      {
        label: 'Dashboard', path: '/dashboard',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h7v7H3zM3 17h7v4H3zM14 3h7v5h-7zM14 12h7v9h-7z" /></svg>,
      },
      {
        label: 'Tickets', path: '/tickets',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
      },
      {
        label: 'Divisions', path: '/departments',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      },
      {
        label: 'Reports', path: '/reports',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      },
    ],
  },
  {
    label: 'Interns',
    roles: ['ALL'],
    items: [
      {
        label: 'Attendance', path: '/checkin',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        badge: 'Live',
      },
    ],
  },
  {
    label: 'Management',
    roles: ['ADMIN', 'MANAGER'],
    items: [
      {
        label: 'Users', path: '/users',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      },
    ],
  },
  {
    label: 'Account',
    roles: ['ALL'],
    items: [
      {
        label: 'My Profile', path: '/profile',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      },
      {
        label: 'Settings', path: '/settings',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      },
    ],
  },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/tickets') return location.pathname.startsWith('/tickets');
    return location.pathname === path;
  };

  const userRole = user?.role?.name?.toUpperCase() ?? '';

  const visibleGroups = navGroups.filter(g =>
    g.roles.includes('ALL') || g.roles.some(r => userRole.includes(r))
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #0d1b2a 0%, #0f2137 100%)' }}>

      {/* ── Header / Logo ──────────────────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* ETS logo block */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1d6fa4 0%, #0e4d7a 100%)' }}>
            <ETSMark />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-sm leading-none tracking-tight">ETS</h1>
            <p className="text-blue-400/70 text-xs mt-0.5 font-medium">Intern Workspace</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold text-blue-400/50 uppercase tracking-widest">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(item.path)
                      ? 'text-white shadow-lg'
                      : 'text-blue-200/50 hover:text-white hover:bg-white/6'
                  }`}
                  style={isActive(item.path) ? {
                    background: 'linear-gradient(135deg, rgba(29,111,164,0.9) 0%, rgba(14,77,122,0.9) 100%)',
                    boxShadow: '0 4px 15px -3px rgba(29,111,164,0.4)',
                  } : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive(item.path) ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── ETS tagline ────────────────────────────────────────────────────── */}
      <div className="mx-3 mb-3 px-3 py-3 rounded-xl border border-white/6 bg-white/3">
        <p className="text-xs text-blue-300/60 leading-relaxed">
          <span className="text-blue-300/90 font-semibold">Eullafied Tech Solutions</span><br />
          Youth-owned IT · North West Province
        </p>
      </div>

      {/* ── User footer ────────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 border-t border-white/8 pt-3">
        <button
          onClick={() => { navigate('/profile'); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/6 transition-colors mb-1 text-left"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1d6fa4, #0e4d7a)' }}>
            {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-blue-300/50 text-xs truncate">{user?.email}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 border"
            style={{ background: 'rgba(29,111,164,0.2)', borderColor: 'rgba(29,111,164,0.4)', color: '#60b4e8' }}>
            {user?.role?.name}
          </span>
        </button>

        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-10">
        <SidebarContent />
      </aside>
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
