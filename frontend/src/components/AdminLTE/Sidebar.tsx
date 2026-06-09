import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  HomeIcon, CalculatorIcon, DocumentTextIcon, UsersIcon,
  BanknotesIcon, ChartBarIcon,
  Cog6ToothIcon, ArrowRightOnRectangleIcon,
  ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  isMobile: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  path?: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children?: { path: string; label: string }[];
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  {
    label: 'Contabil',
    icon: CalculatorIcon,
    children: [
      { path: '/contabil/contas', label: 'Plano de Contas' },
      { path: '/contabil/lancamentos', label: 'Lancamentos' },
      { path: '/contabil/dre', label: 'DRE' },
      { path: '/contabil/balanco', label: 'Balanco' },
    ],
  },
  {
    label: 'Fiscal',
    icon: DocumentTextIcon,
    children: [
      { path: '/fiscal/notas-fiscais', label: 'Notas Fiscais' },
      { path: '/fiscal/apuracao', label: 'Apuracao' },
      { path: '/fiscal/sped', label: 'SPED' },
      { path: '/fiscal/calendario', label: 'Calendario Fiscal' },
    ],
  },
  {
    label: 'Pessoal',
    icon: UsersIcon,
    children: [
      { path: '/pessoal/funcionarios', label: 'Funcionarios' },
      { path: '/pessoal/folha', label: 'Folha de Pagamento' },
      { path: '/pessoal/esocial', label: 'eSocial' },
    ],
  },
  {
    label: 'Financeiro',
    icon: BanknotesIcon,
    children: [
      { path: '/financeiro/pagar', label: 'Contas a Pagar' },
      { path: '/financeiro/receber', label: 'Contas a Receber' },
      { path: '/financeiro/fluxo-caixa', label: 'Fluxo de Caixa' },
    ],
  },
  {
    label: 'Graphify',
    icon: ChartBarIcon,
    children: [
      { path: '/graphify/contabil', label: 'Mapa Contabil' },
      { path: '/graphify/fiscal', label: 'Mapa Fiscal' },
      { path: '/graphify/trabalhista', label: 'Mapa Trabalhista' },
      { path: '/graphify/integracoes', label: 'Integracoes' },
    ],
  },
  {
    label: 'Sistema',
    icon: Cog6ToothIcon,
    children: [
      { path: '/sistema/integracoes', label: 'Integracoes' },
      { path: '/sistema/certidoes', label: 'Certidoes' },
      { path: '/sistema/notificacoes', label: 'Notificacoes' },
      { path: '/sistema/kanban', label: 'Quadro Kanban' },
      { path: '/sistema/perfil', label: 'Meu Perfil' },
    ],
  },
];

export default function Sidebar({ collapsed, onLogout, isMobile, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.children) {
        initial[item.label] = item.children.some((c) => location.pathname === c.path);
      }
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => path ? location.pathname === path : false;
  const isGroupActive = (item: MenuItem) => item.children?.some((c) => location.pathname === c.path) || false;

  return (
    <aside
      className={`main-sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isMobile && !collapsed ? 'mobile-open' : ''}`}
      style={{
        width: collapsed ? 72 : 260,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
      }}
    >
      <Link
        to="/dashboard"
        className="flex items-center justify-center gap-2 h-16 border-b border-white/10"
        onClick={isMobile ? onCloseMobile : undefined}
      >
        {!collapsed ? (
          <span className="text-gradient text-xl font-bold">ContaFlow</span>
        ) : (
          <span className="text-gradient text-lg font-bold">CF</span>
        )}
      </Link>

      <div className="py-4 overflow-y-auto" style={{ height: 'calc(100vh - 64px - 60px)' }}>
        <nav>
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isGroupActive(item)
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      style={isGroupActive(item) ? {
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                        borderLeft: '3px solid #6366f1',
                      } : { borderLeft: '3px solid transparent' }}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {openGroups[item.label] ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>

                    {!collapsed && openGroups[item.label] && (
                      <ul className="mt-1 ml-4 space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              onClick={isMobile ? onCloseMobile : undefined}
                              className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive(child.path)
                                  ? 'text-white bg-indigo-500/20'
                                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path!}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={isActive(item.path) ? {
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                      borderLeft: '3px solid #6366f1',
                    } : { borderLeft: '3px solid transparent' }}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-3 border-t border-white/10"
        style={{ background: 'rgba(15, 23, 42, 0.95)' }}
      >
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sair do Sistema</span>}
        </button>
      </div>
    </aside>
  );
}
