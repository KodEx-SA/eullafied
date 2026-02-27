import { useEffect, useState } from 'react';

interface Department {
  department_id: string;
  department_name: string;
  description?: string;
  user_count: number;
  open_tickets: number;
  head?: string;
}

const deptColors = [
  { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700' },
  { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700' },
  { bg: 'bg-green-600', light: 'bg-green-50', text: 'text-green-700' },
  { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700' },
  { bg: 'bg-pink-600', light: 'bg-pink-50', text: 'text-pink-700' },
];

export const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDepartments([
        { department_id: '1', department_name: 'IT', description: 'Information Technology — manages all tech infrastructure', user_count: 15, open_tickets: 8, head: 'Jane Smith' },
        { department_id: '2', department_name: 'HR', description: 'Human Resources — recruitment, payroll and compliance', user_count: 8, open_tickets: 3, head: 'John Doe' },
        { department_id: '3', department_name: 'Finance', description: 'Finance — budgeting, reporting and audits', user_count: 12, open_tickets: 2, head: 'Alice Brown' },
        { department_id: '4', department_name: 'Operations', description: 'Operations — daily business process management', user_count: 20, open_tickets: 10, head: 'Bob Johnson' },
      ]);
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Departments', value: departments.length, icon: '🏢' },
          { label: 'Total Staff', value: departments.reduce((a, d) => a + d.user_count, 0), icon: '👥' },
          { label: 'Open Tickets', value: departments.reduce((a, d) => a + d.open_tickets, 0), icon: '🎫' },
          { label: 'Avg. Team Size', value: Math.round(departments.reduce((a, d) => a + d.user_count, 0) / departments.length), icon: '📊' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {departments.map((dept, i) => {
          const color = deptColors[i % deptColors.length];
          const initial = dept.department_name[0];
          return (
            <div key={dept.department_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${color.bg} rounded-2xl flex items-center justify-center text-white font-bold text-lg`}>
                    {initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{dept.department_name}</h3>
                    {dept.head && <p className="text-sm text-gray-500">Head: {dept.head}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">View</button>
                </div>
              </div>

              {dept.description && (
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{dept.description}</p>
              )}

              <div className="flex gap-3">
                <div className={`flex-1 ${color.light} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${color.text}`}>{dept.user_count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Staff Members</p>
                </div>
                <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{dept.open_tickets}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Open Tickets</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Name</label>
                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Head</label>
                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  Create Department
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
