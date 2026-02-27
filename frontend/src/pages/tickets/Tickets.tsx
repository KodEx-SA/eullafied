import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  ticket_id: string;
  ticket_number: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  requester_name: string;
}

export const Tickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch tickets from API
    // Mock data for now
    setTimeout(() => {
      setTickets([
        {
          ticket_id: '1',
          ticket_number: 'TN-001',
          title: 'Cannot access email system',
          status: 'Open',
          priority: 'High',
          created_at: '2026-02-26T10:00:00',
          requester_name: 'John Doe',
        },
        {
          ticket_id: '2',
          ticket_number: 'TN-002',
          title: 'Printer not working',
          status: 'In Progress',
          priority: 'Medium',
          created_at: '2026-02-26T09:30:00',
          requester_name: 'Jane Smith',
        },
        {
          ticket_id: '3',
          ticket_number: 'TN-003',
          title: 'Software installation request',
          status: 'Resolved',
          priority: 'Low',
          created_at: '2026-02-25T14:20:00',
          requester_name: 'Bob Johnson',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'in progress':
        return 'status-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <h1>Tickets</h1>
        <button className="btn-primary" onClick={() => navigate('/tickets/new')}>
          ➕ Create New Ticket
        </button>
      </div>

      <div className="tickets-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({tickets.length})
        </button>
        <button
          className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
          onClick={() => setFilter('open')}
        >
          Open ({tickets.filter(t => t.status.toLowerCase() === 'open').length})
        </button>
        <button
          className={`filter-btn ${filter === 'in progress' ? 'active' : ''}`}
          onClick={() => setFilter('in progress')}
        >
          In Progress ({tickets.filter(t => t.status.toLowerCase() === 'in progress').length})
        </button>
        <button
          className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({tickets.filter(t => t.status.toLowerCase() === 'resolved').length})
        </button>
      </div>

      <div className="tickets-table">
        <table>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Requester</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-tickets">
                  No tickets found
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id} onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}>
                  <td className="ticket-number">{ticket.ticket_number}</td>
                  <td className="ticket-title">{ticket.title}</td>
                  <td>{ticket.requester_name}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-action">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
