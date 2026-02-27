import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/auth/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1 className="text-center mt-10 text-2xl">404</h1>} />
    </Routes>
  );
};

export default AppRoutes;