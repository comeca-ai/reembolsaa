import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import PolicyPage from './pages/PolicyPage';
import UsersPage from './pages/UsersPage';
import ViolationDetailPage from './pages/ViolationDetailPage';
import FinancialPage from './pages/FinancialPage';
import NewExpensePage from './pages/NewExpensePage';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import PolicyOnboardingPage from './pages/PolicyOnboardingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ApprovalPage from './pages/ApprovalPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const FullScreenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

// Rota apenas para visitantes (já logado é redirecionado para dentro do app).
const PublicOnly = ({ children }) => {
  const { isAuthenticated, hasEmpresa } = useAuth();
  if (isAuthenticated) return <Navigate to={hasEmpresa ? "/dashboard" : "/comecar"} replace />;
  return children;
};

// Exige sessão. Sem sessão -> login.
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

// Passo 2 do onboarding (subir política). Exige sessão + empresa; admins que
// ainda não concluíram. Quem já concluiu (ou não é admin) vai pro dashboard.
const PolicyOnboardingRoute = () => {
  const { isAuthenticated, hasEmpresa, needsPolicyOnboarding } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasEmpresa) return <Navigate to="/comecar" replace />;
  if (!needsPolicyOnboarding) return <Navigate to="/dashboard" replace />;
  return <PolicyOnboardingPage />;
};

// Layout protegido: exige sessão + empresa. Sem empresa -> onboarding;
// admin sem política configurada -> tela de subir política.
const ProtectedLayout = () => {
  const { isAuthenticated, hasEmpresa, needsPolicyOnboarding } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!hasEmpresa) return <Navigate to="/comecar" replace />;
  if (needsPolicyOnboarding) return <Navigate to="/comecar/politica" replace />;
  return <AppShell />;
};

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) return <FullScreenLoader />;

  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/cadastro" element={<PublicOnly><SignupPage /></PublicOnly>} />

      {/* Autenticado, ainda sem empresa */}
      <Route path="/comecar" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
      {/* Primeiro acesso do admin: subir política */}
      <Route path="/comecar/politica" element={<PolicyOnboardingRoute />} />

      {/* App protegido (sessão + empresa) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/politica" element={<PolicyPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/alertas/:id" element={<ViolationDetailPage />} />
        <Route path="/financeiro" element={<FinancialPage />} />
        <Route path="/nova-despesa" element={<NewExpensePage />} />
        <Route path="/aprovacoes" element={<ApprovalPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App
