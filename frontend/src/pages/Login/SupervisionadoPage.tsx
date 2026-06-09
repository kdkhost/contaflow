import { useState } from 'react';
import api from '../../services/api';
import { notifyError } from '../../utils/notify';

interface SupervisionadoPageProps {
  onLogin: () => void;
}

export default function SupervisionadoPage({ onLogin }: SupervisionadoPageProps) {
  const [emailSupervisor, setEmailSupervisor] = useState('');
  const [senhaSupervisor, setSenhaSupervisor] = useState('');
  const [emailAlvo, setEmailAlvo] = useState('');
  const [senhaAlvo, setSenhaAlvo] = useState('');
  const [tenantId, setTenantId] = useState('contaflow-default');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rSupervisor = await api.post('/auth/login', {
        email: emailSupervisor, senha: senhaSupervisor,
      }, { headers: { 'x-tenant-id': tenantId } });

      const rAlvo = await api.post('/auth/login-supervisionado', {
        emailAlvo, senhaAlvo, emailSupervisor, senhaSupervisor,
      }, { headers: { 'x-tenant-id': tenantId } });

      const { accessToken, refreshToken } = rAlvo.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('empresaId', rAlvo.data.usuario.empresa.id);
      localStorage.setItem('user', JSON.stringify({ ...rAlvo.data.usuario, supervisionado: true, supervisor: rSupervisor.data.usuario }));
      localStorage.setItem('supervisionado', 'true');
      onLogin();
    } catch {
      notifyError('Falha no login supervisionado. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">ContaFlow</h1>
          <p className="dark:text-dark-text-secondary text-gray-500">Login Supervisionado</p>
        </div>

        <div className="card-premium p-8">
          <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              Modo Supervisionado: o supervisor tera acesso total as acoes do usuario supervisionado.
              Todas as acoes serao registradas em auditoria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold dark:text-dark-text-secondary text-gray-500 mb-3 uppercase tracking-wider">Dados do Supervisor</h3>
              <div className="space-y-3">
                <input type="email" value={emailSupervisor} onChange={(e) => setEmailSupervisor(e.target.value)} className="input-premium" placeholder="Email do supervisor" required />
                <input type="password" value={senhaSupervisor} onChange={(e) => setSenhaSupervisor(e.target.value)} className="input-premium" placeholder="Senha do supervisor" required />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold dark:text-dark-text-secondary text-gray-500 mb-3 uppercase tracking-wider">Dados do Usuario Alvo</h3>
              <div className="space-y-3">
                <input type="email" value={emailAlvo} onChange={(e) => setEmailAlvo(e.target.value)} className="input-premium" placeholder="Email do usuario alvo" required />
                <input type="password" value={senhaAlvo} onChange={(e) => setSenhaAlvo(e.target.value)} className="input-premium" placeholder="Senha do usuario alvo" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1">Tenant ID</label>
              <input type="text" value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="input-premium" />
            </div>

            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </span>
              ) : 'Entrar em Modo Supervisionado'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">Voltar ao Login Normal</a>
          </div>
        </div>
      </div>
    </div>
  );
}
