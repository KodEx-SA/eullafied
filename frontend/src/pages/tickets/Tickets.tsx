import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  ticket_id: string;
  ticket_number: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  created_at: string;
  requester_name: string;
}

const statusStyles: Record<string, string> = {
  'Open': 'bg-red-50 text-red-700 border border-red-200',
  'In Progress': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Resolved': 'bg-green-50 text-green-700 border border-green-200',
  'Closed': 'bg-gray-100 text-gray-600 border border-gray-200',
};

const priorityStyles: Record<string, string> = {
  'High': 'bg-red-100 text-red-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Low': 'bg-blue-100 text-blue-700',
};

const priorityDot: Record<string, string> = {
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-blue-500',
};

export const Tickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setTickets([
        { ticket_id: '1', ticket_number: 'TN-001', title: 'Cannot access email system', status: 'Open', priority: 'High', created_at: '2026-02-26T10:00:00', requester_name: 'John Doe' },
        { ticket_id: '2', ticket_number: 'TN-002', title: 'Printer not working', status: 'In Progress', priority: 'Medium', created_at: '2026-02-26T09:30:00', requester_name: 'Jane Smith' },
        { ticket_id: '3', ticket_number: 'TN-003', title: 'Software installation request', status: 'Resolved', priority: 'Low', created_at: '2026-02-25T14:20:00', requester_name: 'Bob Johnson' },
        { ticket_id: '4', ticket_number: 'TN-004', title: 'VPN connection issues', status: 'Open', priority: 'High', created_at: '2026-02-25T11:00:00', requester_name: 'Alice Brown' },
        { ticket_id: '5', ticket_number: 'TN-005', title: 'Password reset request', status: 'Resolved', priority: 'Low', created_at: '2026-02-24T15:45:00', requester_name: 'Mike Davis' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    'in progress': tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  const filtered = tickets.filter(t => {
    const matchFilter = filter === 'all' || t.status.toLowerCase() === filter;
    const matchSearch = !search || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      t.requester_name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">{tickets.length} total tickets</p>
        </div>
        <button
          onClick={() => navigate('/tickets/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {(['all', 'open', 'in progress', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f} ({counts[f as keyof typeof counts]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requester</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p className="text-sm font-medium">No tickets found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => (
                <tr
                  key={ticket.ticket_id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-blue-600">{ticket.ticket_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{ticket.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                        {ticket.requester_name[0]}
                      </div>
                      <span className="text-sm text-gray-700">{ticket.requester_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[ticket.priority]}`} />
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      View
                    </button>
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
