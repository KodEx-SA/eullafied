import { useEffect, useState } from 'react';
import { departmentsService } from '../../services/departments.service';
import type { Department } from '../../types';

const deptColors = [
  { bg: 'bg-blue-600',   light: 'bg-blue-50',   text: 'text-blue-700' },
  { bg: 'bg-purple-600', light: 'bg-purple-50',  text: 'text-purple-700' },
  { bg: 'bg-green-600',  light: 'bg-green-50',   text: 'text-green-700' },
  { bg: 'bg-orange-500', light: 'bg-orange-50',  text: 'text-orange-700' },
  { bg: 'bg-pink-600',   light: 'bg-pink-50',    text: 'text-pink-700' },
];

export const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [form, setForm]               = useState({ name: '', description: '', headOfDepartment: '' });

  const load = () => {
    setLoading(true);
    departmentsService.getAll()
      .then(setDepartments)
      .catch(() => setError('Failed to load departments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await departmentsService.create({
        name: form.name,
        description: form.description || undefined,
        headOfDepartment: form.headOfDepartment || undefined,
      });
      setShowModal(false);
      setForm({ name: '', description: '', headOfDepartment: '' });
      load();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Failed to create department.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 text-sm mt-1">{departments.length} departments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Department
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Departments', value: departments.length,                             icon: '🏢' },
          { label: 'Active',      value: departments.filter(d => d.isActive).length,     icon: '✅' },
          { label: 'Inactive',    value: departments.filter(d => !d.isActive).length,    icon: '⏸️' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      {departments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
          <div className="text-5xl mb-4">🏢</div>
          <p className="font-medium">No departments yet</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-sm text-blue-600 hover:underline">
            Add the first department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {departments.map((dept, i) => {
            const color = deptColors[i % deptColors.length];
            return (
              <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${color.bg} rounded-2xl flex items-center justify-center text-white font-bold text-lg`}>
                      {dept.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                      {dept.headOfDepartment && (
                        <p className="text-sm text-gray-500">Head: {dept.headOfDepartment}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${dept.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {dept.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">{dept.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Add Department</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{formError}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Head</label>
                <input value={form.headOfDepartment} onChange={e => setForm(f => ({ ...f, headOfDepartment: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
                  {saving ? 'Creating...' : 'Create Department'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
