import { Routes, Route, Navigate } from 'react-router-dom';
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
  // Temporarily removed auth check for development
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* Routes without auth protection */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/new-case" element={<NewCasePage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:id" element={<CaseDetailPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/uploads" element={<UploadsPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
      
      {/* Redirect to dashboard by default */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;