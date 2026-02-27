import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface TicketDetail {
  ticket_id: string;
  ticket_number: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  requester_name: string;
  assigned_to?: string;
}

export const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTicket({
        ticket_id: id || '1',
        ticket_number: 'TN-001',
        title: 'Cannot access email system',
        description: 'User reports unable to access company email. Error message: "Connection timeout".',
        status: 'Open',
        priority: 'High',
        created_at: '2026-02-26T10:00:00',
        requester_name: 'John Doe',
        assigned_to: 'IT Support Team',
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="loading">Loading ticket...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="ticket-details-page">
      <button className="btn-back" onClick={() => navigate('/tickets')}>
        ← Back to Tickets
      </button>
      
      <div className="ticket-details-header">
        <div>
          <h1>{ticket.ticket_number}</h1>
          <h2>{ticket.title}</h2>
        </div>
        <div className="ticket-badges">
          <span className="status-badge">{ticket.status}</span>
          <span className="priority-badge">{ticket.priority}</span>
        </div>
      </div>

      <div className="ticket-details-content">
        <div className="ticket-info-section">
          <h3>Ticket Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Requester:</label>
              <span>{ticket.requester_name}</span>
            </div>
            <div className="info-item">
              <label>Created:</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Assigned To:</label>
              <span>{ticket.assigned_to || 'Unassigned'}</span>
            </div>
          </div>
        </div>

        <div className="ticket-description-section">
          <h3>Description</h3>
          <p>{ticket.description}</p>
        </div>

        <div className="ticket-actions-section">
          <button className="btn-primary">Assign to Me</button>
          <button className="btn-secondary">Change Status</button>
          <button className="btn-secondary">Add Comment</button>
        </div>
      </div>
    </div>
  );
};
