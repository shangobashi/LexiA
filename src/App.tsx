import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import DashboardLayout from './components/layouts/dashboard-layout';
import AuthLayout from './components/layouts/auth-layout';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import NewCasePage from './pages/new-case';
import CasesPage from './pages/cases';
import CaseDetailPage from './pages/case-detail';
import BillingPage from './pages/billing';
import UploadsPage from './pages/uploads';
import AccountPage from './pages/account';

function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      </Route>
      
      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/new-case" element={user ? <NewCasePage /> : <Navigate to="/login" />} />
        <Route path="/cases" element={user ? <CasesPage /> : <Navigate to="/login" />} />
        <Route path="/cases/:id" element={user ? <CaseDetailPage /> : <Navigate to="/login" />} />
        <Route path="/billing" element={user ? <BillingPage /> : <Navigate to="/login" />} />
        <Route path="/uploads" element={user ? <UploadsPage /> : <Navigate to="/login" />} />
        <Route path="/account" element={user ? <AccountPage /> : <Navigate to="/login" />} />
      </Route>
      
      {/* Redirect to dashboard or login based on auth status */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;