import { useEffect, useState } from 'react';
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
  department?: string;
}

interface Comment {
  id: string;
  author: string;
  message: string;
  time: string;
  isSystem?: boolean;
}

const statusStyles: Record<string, string> = {
  'Open': 'bg-red-100 text-red-700 border border-red-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Resolved': 'bg-green-100 text-green-700 border border-green-200',
  'Closed': 'bg-gray-100 text-gray-600 border border-gray-200',
};

const priorityStyles: Record<string, string> = {
  'High': 'bg-red-100 text-red-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Low': 'bg-blue-100 text-blue-700',
};

export const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', author: 'IT Support', message: 'Investigating the issue now. Will update shortly.', time: '2026-02-26T11:30:00', isSystem: false },
    { id: '2', author: 'System', message: 'Ticket assigned to IT Support Team', time: '2026-02-26T10:05:00', isSystem: true },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setTicket({
        ticket_id: id || '1',
        ticket_number: 'TN-001',
        title: 'Cannot access email system',
        description: 'User reports being unable to access the company email. The error message displayed is "Connection timeout". Issue started this morning around 9 AM. User has tried restarting the email client and the computer with no success.',
        status: 'Open',
        priority: 'High',
        created_at: '2026-02-26T10:00:00',
        requester_name: 'John Doe',
        assigned_to: 'IT Support Team',
        department: 'HR',
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [
      {
        id: Date.now().toString(),
        author: 'You',
        message: comment,
        time: new Date().toISOString(),
        isSystem: false,
      },
      ...prev,
    ]);
    setComment('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500">Ticket not found.</p>
        <button onClick={() => navigate('/tickets')} className="text-blue-600 hover:underline text-sm">← Back to Tickets</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button + header */}
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
              <span className="text-sm font-semibold text-blue-600">{ticket.ticket_number}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[ticket.status]}`}>{ticket.status}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityStyles[ticket.priority]}`}>{ticket.priority}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
              Assign to Me
            </button>
            <select className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Change Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — description + comments */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{ticket.description}</p>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Activity ({comments.length})</h2>

            {/* Add comment */}
            <div className="flex gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">Y</div>
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className={`flex gap-3 ${c.isSystem ? 'opacity-60' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${c.isSystem ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                    {c.isSystem ? '⚙' : c.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{c.author}</span>
                      <span className="text-xs text-gray-400">{new Date(c.time).toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${c.isSystem ? 'text-gray-500 italic' : 'text-gray-700'}`}>{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — ticket info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Ticket Details</h2>
            <dl className="space-y-4">
              {[
                { label: 'Requester', value: ticket.requester_name },
                { label: 'Department', value: ticket.department ?? 'N/A' },
                { label: 'Assigned To', value: ticket.assigned_to ?? 'Unassigned' },
                { label: 'Created', value: new Date(ticket.created_at).toLocaleString() },
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
