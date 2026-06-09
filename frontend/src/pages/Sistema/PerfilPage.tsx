import { useState } from 'react';
import api from '../../services/api';
import { notifySuccess, notifyError } from '../../utils/notify';
import { UserCircleIcon, KeyIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

function getUser(): Record<string, any> {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  CONTADOR_CHEFE: 'Contador Chefe',
  CONTADOR_ANALISTA: 'Contador Analista',
  AUXILIAR: 'Auxiliar',
  CLIENTE_VISUALIZACAO: 'Cliente Visualizacao',
};

export default function PerfilPage() {
  const user = getUser();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) { notifyError('As senhas nao coincidem'); return; }
    if (novaSenha.length < 6) { notifyError('A nova senha deve ter no minimo 6 caracteres'); return; }
    setLoading(true);
    try {
      await api.post('/auth/change-password', { senhaAtual, novaSenha });
      notifySuccess('Senha alterada com sucesso');
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    } catch {
      notifyError('Erro ao alterar senha. Verifique a senha atual.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{String(user.nome || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-dark-text text-gray-800">{user.nome || 'Usuario'}</h2>
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">{roleLabels[String(user.role)] || user.role || 'AUXILIAR'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg dark:bg-dark-tertiary bg-gray-50">
              <UserCircleIcon className="w-5 h-5 dark:text-dark-text-secondary text-gray-500" />
              <div>
                <p className="text-xs dark:text-dark-text-secondary text-gray-500">Email</p>
                <p className="text-sm font-medium dark:text-dark-text text-gray-800">{user.email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg dark:bg-dark-tertiary bg-gray-50">
              <BuildingOfficeIcon className="w-5 h-5 dark:text-dark-text-secondary text-gray-500" />
              <div>
                <p className="text-xs dark:text-dark-text-secondary text-gray-500">Empresa</p>
                <p className="text-sm font-medium dark:text-dark-text text-gray-800">{user.empresa?.razaoSocial || 'ContaFlow'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-6">
            <KeyIcon className="w-6 h-6 text-primary-500" />
            <h2 className="text-lg font-semibold dark:text-dark-text text-gray-800">Alterar Senha</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1">Senha Atual</label>
              <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} className="input-premium" required />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1">Nova Senha</label>
              <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="input-premium" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="input-premium" required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
