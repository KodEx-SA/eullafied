import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketsService } from '../../services/tickets.service';
import type { Ticket, TicketStatus, TicketPriority } from '../../types';
import { STATUS_LABEL, PRIORITY_LABEL, ticketNumber } from '../../types';
import { useAuth } from '../../auth/AuthContext';

const statusStyles: Record<TicketStatus, string> = {
  open:        'bg-red-100 text-red-700 border border-red-200',
  in_progress: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  resolved:    'bg-green-100 text-green-700 border border-green-200',
  closed:      'bg-gray-100 text-gray-600 border border-gray-200',
  cancelled:   'bg-gray-100 text-gray-500 border border-gray-200',
};

const priorityStyles: Record<TicketPriority, string> = {
  urgent: 'bg-red-100 text-red-700',
  high:   'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-blue-100 text-blue-700',
};

export const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!id) return;
    ticketsService.getOne(id)
      .then(setTicket)
      .catch(() => setError('Ticket not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket) return;
    setSaving(true);
    try {
      const updated = await ticketsService.update(ticket.id, { status });
      setTicket(updated);
    } catch {
      alert('Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!ticket || !user) return;
    setSaving(true);
    try {
      const updated = await ticketsService.update(ticket.id, {
        assignedToId: user.id,
        status: 'in_progress',
      });
      setTicket(updated);
    } catch {
      alert('Failed to assign ticket.');
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

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500">{error ?? 'Ticket not found.'}</p>
        <button onClick={() => navigate('/tickets')} className="text-blue-600 hover:underline text-sm">← Back to Tickets</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tickets
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-blue-600">{ticketNumber(ticket.id)}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[ticket.status]}`}>
                {STATUS_LABEL[ticket.status]}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                {PRIORITY_LABEL[ticket.priority]}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleAssignToMe}
              disabled={saving || ticket.assignedTo?.id === user?.id}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {ticket.assignedTo?.id === user?.id ? '✓ Assigned to Me' : 'Assign to Me'}
            </button>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
              disabled={saving}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — description + notes */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Resolution notes (visible when resolved/closed) */}
          {(ticket.status === 'resolved' || ticket.status === 'closed') && (
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <h2 className="text-base font-semibold text-green-900 mb-3">✅ Resolution Notes</h2>
              {ticket.resolutionNotes ? (
                <p className="text-green-800 text-sm leading-relaxed">{ticket.resolutionNotes}</p>
              ) : (
                <p className="text-green-600 text-sm italic">No resolution notes added.</p>
              )}
              {ticket.resolvedAt && (
                <p className="text-xs text-green-500 mt-3">
                  Resolved on {new Date(ticket.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Add resolution notes */}
          {ticket.status === 'resolved' && !ticket.resolutionNotes && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Add Resolution Notes</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={async () => {
                    if (!comment.trim()) return;
                    setSaving(true);
                    try {
                      const updated = await ticketsService.update(ticket.id, { resolutionNotes: comment });
                      setTicket(updated);
                      setComment('');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={!comment.trim() || saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — ticket info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Ticket Details</h2>
            <dl className="space-y-4">
              {[
                { label: 'Requester',   value: `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}` },
                { label: 'Department',  value: ticket.department.name },
                { label: 'Assigned To', value: ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned' },
                { label: 'Category',    value: ticket.category ?? 'N/A' },
                { label: 'Created',     value: new Date(ticket.createdAt).toLocaleString() },
                { label: 'Updated',     value: new Date(ticket.updatedAt).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Need help?</h3>
            <p className="text-xs text-blue-600 leading-relaxed">
              If this ticket is urgent, contact IT Support directly at ext. 1234 or email support@eullafied.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
