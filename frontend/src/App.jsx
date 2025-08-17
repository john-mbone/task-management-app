import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "./layouts/main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskDashboard from "./pages/TaskDashboard";
import { AppProvider ,AuthProvider} from "./contexts";

export default function App() {
  return (
    <AuthProvider>
      {/* App Context Provider for task mgt */}
      <AppProvider>
        {/* Alert Toaster using sonner - simple impl;mentation */}
        <Toaster position="top-right" richColors />

        <BrowserRouter>
          <Routes>

            {/* Open routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<TaskDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
