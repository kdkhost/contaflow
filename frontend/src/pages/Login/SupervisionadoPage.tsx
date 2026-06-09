import { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyError } from '../../utils/notify';

interface SupervisionadoPageProps {
  onLogin: () => void;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export default function SupervisionadoPage({ onLogin }: SupervisionadoPageProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [emailSupervisor, setEmailSupervisor] = useState('admin@contaflow.com.br');
  const [senhaSupervisor, setSenhaSupervisor] = useState('admin123');
  const [emailAlvo, setEmailAlvo] = useState('');
  const [senhaAlvo, setSenhaAlvo] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const r = await api.get('/auth/usuarios', {
          headers: { 'x-tenant-id': 'contaflow-default' },
        });
        setUsuarios(r.data.data || r.data || []);
      } catch {
        // Fallback: se nao conseguir listar, mostra os conhecidos
        setUsuarios([
          { id: '1', nome: 'Administrador', email: 'admin@contaflow.com.br', role: 'ADMIN' },
          { id: '2', nome: 'Contador Teste', email: 'contador@contaflow.com.br', role: 'CONTADOR_ANALISTA' },
        ]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rAlvo = await api.post('/auth/login-supervisionado', {
        emailAlvo, senhaAlvo, emailSupervisor, senhaSupervisor,
      }, { headers: { 'x-tenant-id': 'contaflow-default' } });

      const rSupervisor = await api.post('/auth/login', {
        email: emailSupervisor, senha: senhaSupervisor,
      }, { headers: { 'x-tenant-id': 'contaflow-default' } });

      localStorage.setItem('token', rAlvo.data.accessToken);
      localStorage.setItem('refreshToken', rAlvo.data.refreshToken);
      localStorage.setItem('tenantId', 'contaflow-default');
      localStorage.setItem('empresaId', rAlvo.data.usuario?.empresaId || '');
      localStorage.setItem('user', JSON.stringify({ ...rAlvo.data.usuario, supervisionado: true, supervisor: rSupervisor.data.usuario }));
      localStorage.setItem('supervisionado', 'true');
      onLogin();
    } catch {
      notifyError('Falha no login. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const selectAlvo = (email: string) => {
    setEmailAlvo(email);
    setSenhaAlvo('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">ContaFlow</h1>
          <p className="text-slate-400">Login Supervisionado</p>
        </div>

        <div className="card-premium p-8">
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400 font-medium">
              Modo Supervisionado: voce acessa o sistema como outro usuario. Todas as acoes sao registradas em auditoria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Seus Dados (Supervisor)</h3>
              <div className="space-y-3">
                <input type="email" value={emailSupervisor} onChange={(e) => setEmailSupervisor(e.target.value)} className="input-premium" placeholder="Seu email" required />
                <input type="password" value={senhaSupervisor} onChange={(e) => setSenhaSupervisor(e.target.value)} className="input-premium" placeholder="Sua senha" required />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Usuario Alvo (quem voce vai supervisionar)</h3>
              {loadingUsers ? (
                <p className="text-sm text-slate-500">Carregando usuarios...</p>
              ) : (
                <div className="space-y-2">
                  {usuarios.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => selectAlvo(u.email)}
                      className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                        emailAlvo === u.email
                          ? 'border-indigo-500/50 bg-indigo-500/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{u.nome}</p>
                      <p className="text-xs text-slate-400">{u.email} &middot; {u.role}</p>
                    </button>
                  ))}
                </div>
              )}
              {emailAlvo && (
                <div className="mt-3">
                  <input type="password" value={senhaAlvo} onChange={(e) => setSenhaAlvo(e.target.value)} className="input-premium" placeholder={`Senha de ${emailAlvo}`} required />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !emailAlvo || !senhaAlvo} className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Autenticando...
                </span>
              ) : 'Entrar em Modo Supervisionado'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Voltar ao Login Normal</a>
          </div>
        </div>
      </div>
    </div>
  );
}
