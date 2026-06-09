import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon, SunIcon, MoonIcon,
  Bars3Icon, ArrowRightOnRectangleIcon, UserIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onMenuToggle: () => void;
  isMobile: boolean;
}

function getUserName(): string {
  try {
    const raw = localStorage.getItem('user');
    if (raw) { const user = JSON.parse(raw); return user.nome || 'Usuario'; }
  } catch {}
  return 'Usuario';
}

function getUserRole(): string {
  try {
    const raw = localStorage.getItem('user');
    if (raw) { const user = JSON.parse(raw); return user.role || 'AUXILIAR'; }
  } catch {}
  return 'AUXILIAR';
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  CONTADOR_CHEFE: 'Contador Chefe',
  CONTADOR_ANALISTA: 'Contador Analista',
  AUXILIAR: 'Auxiliar',
  CLIENTE_VISUALIZACAO: 'Cliente',
};

export default function Header({ theme, onToggleTheme, onLogout, onMenuToggle, isMobile }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userName = getUserName();
  const userRole = getUserRole();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="main-header">
      <div className="flex items-center justify-between w-full h-full px-4">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button onClick={onMenuToggle} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
              <Bars3Icon className="w-6 h-6 text-white" />
            </button>
          )}
          <h1 className="text-gradient text-xl font-bold hidden md:block">ContaFlow</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/sistema/notificacoes')}
            className="relative p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <BellIcon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-amber-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-300" />
            )}
          </button>

          <div className="relative" ref={menuRef as any}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white leading-tight">{userName}</p>
                <p className="text-xs text-slate-400">{roleLabels[userRole] || userRole}</p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden animate-slide-in z-50"
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-bold text-white">{userName}</p>
                  <p className="text-xs text-slate-400">{roleLabels[userRole] || userRole}</p>
                </div>
                <button
                  onClick={() => { navigate('/sistema/perfil'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Meu Perfil
                </button>
                <div className="border-t border-white/10">
                  <button
                    onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Sair do Sistema
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
