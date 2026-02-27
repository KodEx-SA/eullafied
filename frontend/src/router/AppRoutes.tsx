import { Routes, Route, Navigate } from 'react-router-dom';
import { Login }         from '../pages/auth/Login';
import { Dashboard }     from '../pages/dashboard/Dashboard';
import { Tickets }       from '../pages/tickets/Tickets';
import { TicketDetails } from '../pages/tickets/TicketDetails';
import { CreateTicket }  from '../pages/tickets/CreateTicket';
import { Users }         from '../pages/users/Users';
import { Departments }   from '../pages/departments/Departments';
import { Reports }       from '../pages/reports/Reports';
import { CheckIn }       from '../pages/checkin/CheckIn';
import { Profile }       from '../pages/profile/Profile';
import { Settings }      from '../pages/settings/Settings';
import { NotFound }      from '../pages/NotFound';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute }  from '../auth/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/"      element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/tickets"     element={<Tickets />} />
      <Route path="/tickets/new" element={<CreateTicket />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/reports"     element={<Reports />} />
      <Route path="/checkin"     element={<CheckIn />} />
      <Route path="/profile"     element={<Profile />} />
      <Route path="/settings"    element={<Settings />} />
      <Route path="/users"       element={<Users />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
