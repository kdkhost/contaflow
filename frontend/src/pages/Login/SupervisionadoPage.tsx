import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { notifyError } from '../../utils/notify';

interface SupervisionadoPageProps {
  onLogin: () => void;
}

const usuariosConhecidos = [
  { nome: 'Administrador', email: 'admin@contaflow.com.br', role: 'ADMIN', icon: 'A' },
  { nome: 'Marcelo SuperAdmin', email: 'mareclobradrj@gmail.com', role: 'ADMIN', icon: 'M' },
  { nome: 'Contador Teste', email: 'contador@contaflow.com.br', role: 'CONTADOR_ANALISTA', icon: 'C' },
];

export default function SupervisionadoPage({ onLogin }: SupervisionadoPageProps) {
  const [emailSupervisor, setEmailSupervisor] = useState('mareclobradrj@gmail.com');
  const [senhaSupervisor, setSenhaSupervisor] = useState('83388601Mm...');
  const [emailAlvo, setEmailAlvo] = useState('');
  const [senhaAlvo, setSenhaAlvo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSupervisorPass, setShowSupervisorPass] = useState(false);
  const [showAlvoPass, setShowAlvoPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAlvo || !senhaAlvo) {
      notifyError('Selecione um usuario alvo e informe a senha.');
      return;
    }
    setLoading(true);
    try {
      const rAlvo = await api.post('/auth/login-supervisionado', {
        emailAlvo, senhaAlvo, emailSupervisor, senhaSupervisor,
      }, { headers: { 'x-tenant-id': 'contaflow-default' } });

      localStorage.setItem('token', rAlvo.data.accessToken);
      localStorage.setItem('refreshToken', rAlvo.data.refreshToken);
      localStorage.setItem('tenantId', 'contaflow-default');
      localStorage.setItem('empresaId', rAlvo.data.usuario?.empresaId || '');
      localStorage.setItem('user', JSON.stringify({ ...rAlvo.data.usuario, supervisionado: true }));
      localStorage.setItem('supervisionado', 'true');
      onLogin();
    } catch {
      notifyError('Falha no login. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h1 className="text-5xl font-black text-gradient mb-2">ContaFlow</h1>
          <p className="text-slate-400 text-sm">Login Supervisionado</p>
        </div>

        <div className="card-premium p-8">
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400 font-medium leading-relaxed">
              Acesse o sistema como outro usuario. Todas as acoes sao registradas em auditoria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Supervisor</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  value={emailSupervisor}
                  onChange={(e) => setEmailSupervisor(e.target.value)}
                  className="input-premium"
                  placeholder="Seu email"
                  required
                />
                <div className="relative">
                  <input
                    type={showSupervisorPass ? 'text' : 'password'}
                    value={senhaSupervisor}
                    onChange={(e) => setSenhaSupervisor(e.target.value)}
                    className="input-premium pr-12"
                    placeholder="Sua senha"
                    required
                  />
                  <button type="button" onClick={() => setShowSupervisorPass(!showSupervisorPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Usuario Alvo</h3>
              <div className="space-y-2">
                {usuariosConhecidos.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => { setEmailAlvo(u.email); setSenhaAlvo('admin123'); }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
                      emailAlvo === u.email
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{u.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{u.nome}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg flex-shrink-0">{u.role}</span>
                  </button>
                ))}
              </div>

              {emailAlvo && (
                <div className="mt-3">
                  <label className="block text-xs font-bold text-slate-400 mb-2">Senha do alvo</label>
                  <div className="relative">
                    <input
                      type={showAlvoPass ? 'text' : 'password'}
                      value={senhaAlvo}
                      onChange={(e) => setSenhaAlvo(e.target.value)}
                      className="input-premium pr-12"
                      placeholder={`Senha de ${emailAlvo}`}
                      required
                    />
                    <button type="button" onClick={() => setShowAlvoPass(!showAlvoPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !emailAlvo || !senhaAlvo} className="w-full btn-primary py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Entrando...
                </span>
              ) : 'Entrar em Modo Supervisionado'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link to="/" className="text-sm text-slate-400 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Voltar ao Login Normal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
