import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { notifyError } from '../utils/notify';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('admin@contaflow.com.br');
  const [senha, setSenha] = useState('admin123');
  const [tenantId, setTenantId] = useState('contaflow-default');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha }, {
        headers: { 'x-tenant-id': tenantId },
      });
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('empresaId', response.data.usuario.empresa.id);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      onLogin();
    } catch {
      notifyError('Credenciais invalidas. Verifique email e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">CF</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">ContaFlow</h1>
          <p className="dark:text-dark-text-secondary text-gray-500">Sistema Contabil Completo</p>
        </div>

        <div className="card-premium p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1.5">Tenant ID</label>
              <input type="text" value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="input-premium" placeholder="tenant-id" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1.5">Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="input-premium" placeholder="Sua senha" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Entrar'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">
            Credenciais padrao: admin@contaflow.com.br / admin123
          </p>
          <Link to="/login-supervisionado" className="text-sm text-primary-500 hover:text-primary-400 font-medium transition-colors">
            Login Supervisionado
          </Link>
        </div>
      </div>
    </div>
  );
}
