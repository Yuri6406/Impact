import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClientAuthProvider, useClientAuth } from './contexts/ClientAuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentDetails from './components/StudentDetails';
import NewStudent from './components/NewStudent';
import ClientLogin from './components/ClientLogin';
import ClientDashboard from './components/ClientDashboard';
import Loading from './components/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/admin/login" replace />;
};

const ClientProtectedRoute = ({ children }) => {
  const { user, loading } = useClientAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/client/login" replace />;
};

const AdminRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route 
        path="/admin/login" 
        element={user ? <Navigate to="/admin" replace /> : <Login />} 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/student/:id" 
        element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/new-student" 
        element={
          <ProtectedRoute>
            <NewStudent />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const ClientRoutes = () => {
  const { user, loading } = useClientAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route 
        path="/client/login" 
        element={user ? <Navigate to="/client" replace /> : <ClientLogin />} 
      />
      <Route 
        path="/client" 
        element={
          <ClientProtectedRoute>
            <ClientDashboard />
          </ClientProtectedRoute>
        } 
      />
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/client/*" element={<ClientRoutes />} />
      <Route path="/" element={<Navigate to="/client" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ClientAuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </ClientAuthProvider>
    </AuthProvider>
  );
}

export default App;
