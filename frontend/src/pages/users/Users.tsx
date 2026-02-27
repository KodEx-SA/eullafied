import React, { useEffect, useState } from 'react';

interface User {
  user_id: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  department: string;
  is_active: boolean;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API
    setTimeout(() => {
      setUsers([
        { user_id: '1', email: 'admin@example.com', name: 'Admin', surname: 'User', role: 'Admin', department: 'IT', is_active: true },
        { user_id: '2', email: 'john@example.com', name: 'John', surname: 'Doe', role: 'Staff', department: 'HR', is_active: true },
        { user_id: '3', email: 'jane@example.com', name: 'Jane', surname: 'Smith', role: 'Manager', department: 'IT', is_active: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>User Management</h1>
        <button className="btn-primary">➕ Add New User</button>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id}>
                <td>{user.name} {user.surname}</td>
                <td>{user.email}</td>
                <td><span className="role-badge">{user.role}</span></td>
                <td>{user.department}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-action">Edit</button>
                  <button className="btn-action">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
