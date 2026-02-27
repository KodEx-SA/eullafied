import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    // For now, using mock data
    setTimeout(() => {
      setStats({
        totalTickets: 156,
        openTickets: 23,
        inProgressTickets: 45,
        resolvedTickets: 88,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p className="dashboard-subtitle">
          Here's an overview of your ticketing system
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Tickets</h3>
            <p className="stat-number">{stats.totalTickets}</p>
          </div>
        </div>

        <div className="stat-card open">
          <div className="stat-icon">🎫</div>
          <div className="stat-info">
            <h3>Open Tickets</h3>
            <p className="stat-number">{stats.openTickets}</p>
          </div>
        </div>

        <div className="stat-card progress">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgressTickets}</p>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolvedTickets}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🎫</span>
              <div className="activity-details">
                <p className="activity-title">New ticket created</p>
                <p className="activity-time">5 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-details">
                <p className="activity-title">Ticket #TN-123 resolved</p>
                <p className="activity-time">1 hour ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-details">
                <p className="activity-title">New user registered</p>
                <p className="activity-time">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn create-ticket">
              <span>➕</span>
              Create Ticket
            </button>
            <button className="action-btn view-tickets">
              <span>📋</span>
              View All Tickets
            </button>
            <button className="action-btn manage-users">
              <span>👥</span>
              Manage Users
            </button>
            <button className="action-btn settings">
              <span>⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
