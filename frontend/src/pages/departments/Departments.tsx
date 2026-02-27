import React, { useEffect, useState } from 'react';

interface Department {
  department_id: string;
  department_name: string;
  description?: string;
  user_count: number;
}

export const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDepartments([
        { department_id: '1', department_name: 'IT', description: 'Information Technology', user_count: 15 },
        { department_id: '2', department_name: 'HR', description: 'Human Resources', user_count: 8 },
        { department_id: '3', department_name: 'Finance', description: 'Finance Department', user_count: 12 },
        { department_id: '4', department_name: 'Operations', description: 'Operations Team', user_count: 20 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading departments...</div>;

  return (
    <div className="departments-page">
      <div className="departments-header">
        <h1>Departments</h1>
        <button className="btn-primary">➕ Add Department</button>
      </div>
      <div className="departments-grid">
        {departments.map(dept => (
          <div key={dept.department_id} className="department-card">
            <h3>{dept.department_name}</h3>
            <p className="department-description">{dept.description}</p>
            <div className="department-stats">
              <span className="stat-label">👥 Users:</span>
              <span className="stat-value">{dept.user_count}</span>
            </div>
            <div className="department-actions">
              <button className="btn-action">Edit</button>
              <button className="btn-action">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
