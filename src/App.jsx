import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import PageNotFound from './components/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { phoneGateSkipped } from '@/lib/telefone';
import { MOCK_MODULES_ENABLED } from '@/lib/features';
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
import AceitarConvitePage from './pages/AceitarConvitePage';
import CompletarPerfilPage from './pages/CompletarPerfilPage';
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
  const { isAuthenticated, hasEmpresa, needsPolicyOnboarding, needsPhone } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!hasEmpresa) return <Navigate to="/comecar" replace />;
  if (needsPolicyOnboarding) return <Navigate to="/comecar/politica" replace />;
  // Sem WhatsApp salvo (legado) -> completar antes de usar o app. Quem não
  // consegue salvar (número já em outra conta) pode pular e não fica trancado.
  if (needsPhone && !phoneGateSkipped()) return <Navigate to="/completar-perfil" replace />;
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
      {/* Aceite de convite: o link cria a sessão; o convidado define a senha.
          Não fica sob PublicOnly porque o convite já deixa o usuário logado. */}
      <Route path="/aceitar-convite" element={<AceitarConvitePage />} />

      {/* Gate de perfil: completar WhatsApp (legados sem o número) */}
      <Route path="/completar-perfil" element={<RequireAuth><CompletarPerfilPage /></RequireAuth>} />

      {/* Autenticado, ainda sem empresa */}
      <Route path="/comecar" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
      {/* Primeiro acesso do admin: subir política */}
      <Route path="/comecar/politica" element={<PolicyOnboardingRoute />} />

      {/* App protegido (sessão + empresa) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/politica" element={<PolicyPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/nova-despesa" element={<NewExpensePage />} />
        <Route path="/aprovacoes" element={<ApprovalPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
        {/* Módulos ainda mock: escondidos até integração real (lib/features). */}
        <Route path="/alertas/:id" element={MOCK_MODULES_ENABLED ? <ViolationDetailPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/financeiro" element={MOCK_MODULES_ENABLED ? <FinancialPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/relatorios" element={MOCK_MODULES_ENABLED ? <ReportsPage /> : <Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
