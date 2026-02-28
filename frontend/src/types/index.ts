// ── Auth ──────────────────────────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  isActive: boolean;
  role: Role;
  department?: Department;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ── Tickets ───────────────────────────────────────────────────────────────
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  createdBy: User;
  assignedTo?: User;
  department: Department;
  resolvedAt?: string;
  closedAt?: string;
  resolutionNotes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  departmentId: string;
  category?: string;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assignedToId?: string;
  resolutionNotes?: string;
}

// ── Display helpers ────────────────────────────────────────────────────────
export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const ticketNumber = (id: string) =>
  `TN-${id.slice(0, 6).toUpperCase()}`;
