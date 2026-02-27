import { useState } from 'react';

type Tab = 'general' | 'notifications' | 'security' | 'appearance';

const Toggle = ({ checked, onChange, label, desc }: { checked: boolean; onChange: () => void; label: string; desc?: string }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">{title}</h3>
    <div className="divide-y divide-gray-50">{children}</div>
  </div>
);

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    language: 'English',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'DD/MM/YYYY',
    defaultView: 'Dashboard',
  });

  const [notifs, setNotifs] = useState({
    emailOnAssign: true,
    emailOnResolve: true,
    emailOnComment: false,
    pushNewTicket: true,
    pushStatusChange: true,
    pushMention: true,
    weeklyDigest: false,
  });

  const [appearance, setAppearance] = useState({
    compactMode: false,
    sidebarCollapsed: false,
    highContrast: false,
  });

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleApp = (key: keyof typeof appearance) =>
    setAppearance(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'general',       label: 'General',       icon: '⚙️' },
    { id: 'notifications', label: 'Notifications',  icon: '🔔' },
    { id: 'security',      label: 'Security',       icon: '🔒' },
    { id: 'appearance',    label: 'Appearance',     icon: '🎨' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your preferences and account settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-base">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-emerald-700 text-sm font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-5">
          <Section title="Regional Preferences">
            {[
              { label: 'Language', key: 'language' as const, options: ['English', 'Afrikaans', 'Zulu', 'French'] },
              { label: 'Timezone', key: 'timezone' as const, options: ['Africa/Johannesburg', 'UTC', 'Europe/London', 'America/New_York'] },
              { label: 'Date Format', key: 'dateFormat' as const, options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
            ].map(({ label, key, options }) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
                <label className="text-sm font-medium text-gray-800">{label}</label>
                <select
                  value={general[key]}
                  onChange={e => setGeneral(p => ({ ...p, [key]: e.target.value }))}
                  className="sm:w-48 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </Section>

          <Section title="Default View">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Landing page after sign in</p>
                <p className="text-xs text-gray-400">Choose which page you see first.</p>
              </div>
              <select
                value={general.defaultView}
                onChange={e => setGeneral(p => ({ ...p, defaultView: e.target.value }))}
                className="sm:w-48 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Dashboard', 'Tickets', 'Reports', 'Check-In'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </Section>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-5">
          <Section title="Email Notifications">
            <Toggle checked={notifs.emailOnAssign}  onChange={() => toggleNotif('emailOnAssign')}  label="Ticket assigned to me"    desc="Receive an email when a ticket is assigned to you." />
            <Toggle checked={notifs.emailOnResolve} onChange={() => toggleNotif('emailOnResolve')} label="Ticket resolved"           desc="Receive an email when one of your tickets is resolved." />
            <Toggle checked={notifs.emailOnComment} onChange={() => toggleNotif('emailOnComment')} label="New comment on my tickets" desc="Email when someone comments on your ticket." />
            <Toggle checked={notifs.weeklyDigest}   onChange={() => toggleNotif('weeklyDigest')}   label="Weekly digest"            desc="A summary of ticket activity sent every Monday." />
          </Section>
          <Section title="Push Notifications">
            <Toggle checked={notifs.pushNewTicket}    onChange={() => toggleNotif('pushNewTicket')}    label="New ticket created"   desc="Get notified when a new ticket is opened." />
            <Toggle checked={notifs.pushStatusChange} onChange={() => toggleNotif('pushStatusChange')} label="Status changes"       desc="Notifications for ticket status updates." />
            <Toggle checked={notifs.pushMention}      onChange={() => toggleNotif('pushMention')}      label="Mentions & replies"   desc="When someone mentions you in a comment." />
          </Section>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          <Section title="Password">
            <div className="py-2 space-y-4">
              {[
                { label: 'Current password', id: 'cur' },
                { label: 'New password',     id: 'new' },
                { label: 'Confirm new password', id: 'con' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              ))}
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
                Update Password
              </button>
            </div>
          </Section>

          <Section title="Two-Factor Authentication">
            <div className="py-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">Authenticator app</p>
                  <p className="text-xs text-gray-400 mt-0.5">Use an app like Google Authenticator for extra security.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Not configured
                </span>
              </div>
              <button className="mt-4 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Set Up 2FA
              </button>
            </div>
          </Section>

          <Section title="Active Sessions">
            <div className="py-2 space-y-3">
              {[
                { device: 'Chrome · Windows 11', location: 'Rustenburg, SA', active: true },
                { device: 'Safari · iPhone 15',  location: 'Rustenburg, SA', active: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      {s.active ? '💻' : '📱'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.device}</p>
                      <p className="text-xs text-gray-400">{s.location}</p>
                    </div>
                  </div>
                  {s.active
                    ? <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Current</span>
                    : <button className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors">Revoke</button>
                  }
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Appearance */}
      {activeTab === 'appearance' && (
        <div className="space-y-5">
          <Section title="Display">
            <Toggle checked={appearance.compactMode}      onChange={() => toggleApp('compactMode')}      label="Compact mode"         desc="Reduce spacing for a denser layout." />
            <Toggle checked={appearance.sidebarCollapsed} onChange={() => toggleApp('sidebarCollapsed')} label="Collapse sidebar by default" desc="Start with the sidebar collapsed on load." />
            <Toggle checked={appearance.highContrast}     onChange={() => toggleApp('highContrast')}     label="High contrast mode"   desc="Increase contrast for better readability." />
          </Section>

          <Section title="Theme">
            <div className="py-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Light',   bg: 'bg-white border-2 border-blue-500', text: 'text-gray-900', active: true },
                { label: 'Dark',    bg: 'bg-gray-900 border-2 border-transparent', text: 'text-white', active: false },
                { label: 'System',  bg: 'bg-gradient-to-r from-white to-gray-900 border-2 border-transparent', text: 'text-gray-700', active: false },
              ].map(t => (
                <button key={t.label} className={`${t.bg} rounded-xl p-4 text-left transition-all hover:scale-[1.02]`}>
                  <div className="h-8 rounded-lg mb-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20" />
                  <p className={`text-xs font-semibold ${t.text} ${t.label === 'Dark' || t.label === 'System' ? 'text-white' : ''}`}>{t.label}</p>
                  {t.active && <span className="text-xs text-blue-600 font-medium">Active</span>}
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Save bar */}
      <div className="flex justify-end gap-3 pb-4">
        <button className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Reset to Defaults
        </button>
        <button onClick={handleSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
};
