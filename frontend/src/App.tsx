import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Layout from './components/AdminLTE/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ContasPage from './pages/Contabil/ContasPage';
import LancamentosPage from './pages/Contabil/LancamentosPage';
import DREPage from './pages/Contabil/DREPage';
import BalancoPage from './pages/Contabil/BalancoPage';
import NotasFiscaisPage from './pages/Fiscal/NotasFiscaisPage';
import ApuracaoPage from './pages/Fiscal/ApuracaoPage';
import SPEDPage from './pages/Fiscal/SPEDPage';
import CalendarioFiscalPage from './pages/Fiscal/CalendarioFiscalPage';
import FuncionariosPage from './pages/Pessoal/FuncionariosPage';
import FolhaPage from './pages/Pessoal/FolhaPage';
import ESocialPage from './pages/Pessoal/ESocialPage';
import ContasPagarPage from './pages/Financeiro/ContasPagarPage';
import ContasReceberPage from './pages/Financeiro/ContasReceberPage';
import FluxoCaixaPage from './pages/Financeiro/FluxoCaixaPage';
import MapaContabilPage from './pages/Graphify/MapaContabilPage';
import MapaFiscalPage from './pages/Graphify/MapaFiscalPage';
import MapaTrabalhistaPage from './pages/Graphify/MapaTrabalhistaPage';
import IntegracoesPage from './pages/Graphify/IntegracoesPage';
import GestaoIntegracoesPage from './pages/Sistema/GestaoIntegracoesPage';
import CertidoesPage from './pages/Sistema/CertidoesPage';
import NotificacoesPage from './pages/Sistema/NotificacoesPage';
import KanbanPage from './pages/Sistema/KanbanPage';
import PerfilPage from './pages/Sistema/PerfilPage';
import SupervisionadoPage from './pages/Login/SupervisionadoPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('empresaId');
    setIsAuthenticated(false);
  }, []);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login-supervisionado" element={<SupervisionadoPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="*" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
      </Routes>
    );
  }

  return (
    <Layout theme={theme} onToggleTheme={toggleTheme} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contabil/contas" element={<ContasPage />} />
        <Route path="/contabil/lancamentos" element={<LancamentosPage />} />
        <Route path="/contabil/dre" element={<DREPage />} />
        <Route path="/contabil/balanco" element={<BalancoPage />} />
        <Route path="/fiscal/notas-fiscais" element={<NotasFiscaisPage />} />
        <Route path="/fiscal/apuracao" element={<ApuracaoPage />} />
        <Route path="/fiscal/sped" element={<SPEDPage />} />
        <Route path="/fiscal/calendario" element={<CalendarioFiscalPage />} />
        <Route path="/pessoal/funcionarios" element={<FuncionariosPage />} />
        <Route path="/pessoal/folha" element={<FolhaPage />} />
        <Route path="/pessoal/esocial" element={<ESocialPage />} />
        <Route path="/financeiro/pagar" element={<ContasPagarPage />} />
        <Route path="/financeiro/receber" element={<ContasReceberPage />} />
        <Route path="/financeiro/fluxo-caixa" element={<FluxoCaixaPage />} />
        <Route path="/graphify/contabil" element={<MapaContabilPage />} />
        <Route path="/graphify/fiscal" element={<MapaFiscalPage />} />
        <Route path="/graphify/trabalhista" element={<MapaTrabalhistaPage />} />
        <Route path="/graphify/integracoes" element={<IntegracoesPage />} />
        <Route path="/sistema/integracoes" element={<GestaoIntegracoesPage />} />
        <Route path="/sistema/certidoes" element={<CertidoesPage />} />
        <Route path="/sistema/notificacoes" element={<NotificacoesPage />} />
        <Route path="/sistema/kanban" element={<KanbanPage />} />
        <Route path="/sistema/perfil" element={<PerfilPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
