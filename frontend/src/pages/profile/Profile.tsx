import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const InputField = ({ label, value, name, type = 'text', onChange, disabled = false }: {
  label: string; value: string; name: string; type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} disabled={disabled}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-colors ${
        disabled
          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      }`}
    />
  </div>
);

export const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: '+27 82 123 4567',
    jobTitle: 'IT Support Technician',
    department: 'Information Technology',
    location: 'Rustenburg, South Africa',
    bio: 'Passionate IT professional focused on delivering efficient technical support and solutions.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-lg flex-shrink-0">
                {initials}
              </div>
              <div className="pb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
                <p className="text-gray-500 text-sm">{form.jobTitle} · {form.department}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors">
                    {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
          {saved && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-emerald-700 text-sm font-medium">Profile updated successfully!</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} disabled={!editing} />
              <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} disabled={!editing} />
              <InputField label="Email" name="email" value={form.email} type="email" onChange={handleChange} disabled={!editing} />
              <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} disabled={!editing} />
              <InputField label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} disabled={!editing} />
              <InputField label="Location" name="location" value={form.location} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                name="bio" value={form.bio} onChange={handleChange} disabled={!editing} rows={3}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm resize-none transition-colors ${
                  !editing
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>
          </div>

          {/* Work Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Work Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Department" name="department" value={form.department} onChange={handleChange} disabled={!editing} />
              <InputField label="Role" name="role" value={user?.role ?? ''} onChange={() => {}} disabled />
            </div>
          </div>
        </div>

        {/* Side cards */}
        <div className="space-y-5">
          {/* Quick stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Activity Summary</h2>
            <div className="space-y-3">
              {[
                { label: 'Tickets Assigned', value: 23, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Tickets Resolved', value: 18, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Avg. Response Time', value: '2.4h', color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Satisfaction Rate', value: '96%', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(s => (
                <div key={s.label} className={`flex items-center justify-between px-4 py-3 ${s.bg} rounded-xl`}>
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input type="password" disabled={!editing} placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" disabled={!editing} placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed" />
              </div>
            </div>
            {editing && (
              <button className="mt-3 w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Update Password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
