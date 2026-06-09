import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { notifySuccess, notifyError } from '../../utils/notify';

type Tab = 'geral' | 'seguranca' | 'email' | 'biometria' | 'conta';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'conta', label: 'Minha Conta', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'seguranca', label: 'Seguranca', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'email', label: 'Email SMTP', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'biometria', label: 'Biometria', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
];

export default function ConfiguracoesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('conta');
  const [user, setUser] = useState<any>(null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [smtpForm, setSmtpForm] = useState({ host: '', port: 587, user: '', pass: '', from: '', secure: false });
  const [notificacoes, setNotificacoes] = useState({ emailAlertas: true, emailRelatorios: false, pushVencimentos: true, pushObrigacoes: true });
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaSecret, setTwoFaSecret] = useState('');
  const [twoFaQrUrl, setTwoFaQrUrl] = useState('');
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [biometriaDevices, setBiometriaDevices] = useState<any[]>([]);
  const [biometriaNome, setBiometriaNome] = useState('');
  const [seguranca, setSeguranca] = useState({ sessionTimeout: 30, maxLoginAttempts: 5, passwordMinLength: 8 });

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const { data: config, isLoading } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: () => api.get('/configuracoes').then((r) => r.data),
  });

  useEffect(() => {
    if (config) {
      if (config.smtp) setSmtpForm(config.smtp);
      if (config.notificacoes) setNotificacoes(config.notificacoes);
      if (config.seguranca) setSeguranca(config.seguranca);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => api.put('/configuracoes', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['configuracoes'] }); notifySuccess('Configuracoes salvas!'); },
    onError: () => notifyError('Erro ao salvar configuracoes'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/change-password', data),
    onSuccess: () => { notifySuccess('Senha alterada com sucesso!'); setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha(''); },
    onError: () => notifyError('Senha atual incorreta'),
  });

  const testSmtpMutation = useMutation({
    mutationFn: (data: any) => api.post('/configuracoes/smtp/test', data),
    onSuccess: (r) => notifySuccess(r.data.message),
    onError: () => notifyError('Falha na conexao SMTP'),
  });

  const setup2FaMutation = useMutation({
    mutationFn: () => api.post('/configuracoes/2fa/setup'),
    onSuccess: (r) => { setTwoFaSecret(r.data.secret); setTwoFaQrUrl(r.data.otpauth); },
    onError: () => notifyError('Erro ao configurar 2FA'),
  });

  const confirm2FaMutation = useMutation({
    mutationFn: (code: string) => api.post('/configuracoes/2fa/confirm', { code }),
    onSuccess: () => { setTwoFaEnabled(true); setTwoFaCode(''); setTwoFaSecret(''); notifySuccess('2FA ativado!'); },
    onError: () => notifyError('Codigo invalido'),
  });

  const disable2FaMutation = useMutation({
    mutationFn: () => api.delete('/configuracoes/2fa'),
    onSuccess: () => { setTwoFaEnabled(false); notifySuccess('2FA desativado'); },
    onError: () => notifyError('Erro ao desativar 2FA'),
  });

  const registerBiometriaMutation = useMutation({
    mutationFn: (data: any) => api.post('/configuracoes/biometria', data),
    onSuccess: () => { loadBiometria(); notifySuccess('Biometria registrada!'); },
    onError: () => notifyError('Erro ao registrar biometria'),
  });

  const removeBiometriaMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/configuracoes/biometria/${id}`),
    onSuccess: () => { loadBiometria(); notifySuccess('Biometria removida'); },
    onError: () => notifyError('Erro ao remover'),
  });

  const loadBiometria = async () => {
    try { const r = await api.get('/configuracoes/biometria'); setBiometriaDevices(r.data); } catch {}
  };

  useEffect(() => { if (activeTab === 'biometria') loadBiometria(); }, [activeTab]);

  const handleRegisterBiometria = async () => {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'ContaFlow' },
          user: { id: new Uint8Array(16), name: user?.email || 'user', displayName: user?.nome || 'User' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
          timeout: 60000,
          authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
        },
      } as any);
      if (credential) {
        registerBiometriaMutation.mutate({
          credentialId: btoa(String.fromCharCode(...new Uint8Array((credential as any).rawId))),
          publicKey: 'webauthn',
          deviceName: biometriaNome || navigator.platform,
        });
      }
    } catch (e: any) {
      notifyError('Biometria nao suportada ou negada: ' + (e.message || ''));
    }
  };

  const handleSaveSmtp = () => saveMutation.mutate({ smtp: smtpForm });
  const handleSaveNotificacoes = () => saveMutation.mutate({ notificacoes });
  const handleSaveSeguranca = () => saveMutation.mutate({ seguranca });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) { notifyError('As senhas nao conferem'); return; }
    if (novaSenha.length < 8) { notifyError('Minimo 8 caracteres'); return; }
    changePasswordMutation.mutate({ currentPassword: senhaAtual, newPassword: novaSenha });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Configuracoes</h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === t.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} /></svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* MINHA CONTA */}
      {activeTab === 'conta' && (
        <div className="card-premium p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Dados da Conta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Nome</label>
              <input type="text" value={user?.nome || ''} readOnly className="input-premium opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Email</label>
              <input type="email" value={user?.email || ''} readOnly className="input-premium opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Role</label>
              <input type="text" value={user?.role || ''} readOnly className="input-premium opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Tenant</label>
              <input type="text" value={user?.tenantId || ''} readOnly className="input-premium opacity-60 cursor-not-allowed" />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-base font-bold text-white mb-4">Alterar Senha</h3>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">Senha Atual</label>
                <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} className="input-premium" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">Nova Senha</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="input-premium" minLength={8} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">Confirmar Nova Senha</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="input-premium" minLength={8} required />
              </div>
              <button type="submit" disabled={changePasswordMutation.isPending} className="btn-primary">
                {changePasswordMutation.isPending ? 'Salvando...' : 'Alterar Senha'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SEGURANCA */}
      {activeTab === 'seguranca' && (
        <div className="space-y-6">
          {/* 2FA */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Autenticacao em 2 Fatores (2FA)</h2>
                <p className="text-sm text-slate-400 mt-1">Adicione uma camada extra de seguranca com Google Authenticator</p>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${twoFaEnabled || config?.seguranca?.twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {twoFaEnabled || config?.seguranca?.twoFactorEnabled ? 'ATIVADO' : 'DESATIVADO'}
              </span>
            </div>

            {!twoFaEnabled && !twoFaSecret && (
              <button onClick={() => setup2FaMutation.mutate()} disabled={setup2FaMutation.isPending} className="btn-primary">
                {setup2FaMutation.isPending ? 'Configurando...' : 'Ativar 2FA'}
              </button>
            )}

            {twoFaSecret && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Escaneie o QR Code com Google Authenticator:</p>
                <div className="bg-white p-4 rounded-xl inline-block">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(twoFaQrUrl)}`} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-1.5">Codigo de verificacao</label>
                  <input type="text" value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)} className="input-premium max-w-xs" placeholder="000000" maxLength={6} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => confirm2FaMutation.mutate(twoFaCode)} disabled={twoFaCode.length < 6 || confirm2FaMutation.isPending} className="btn-primary">
                    {confirm2FaMutation.isPending ? 'Confirmando...' : 'Confirmar'}
                  </button>
                  <button onClick={() => { setTwoFaSecret(''); setTwoFaCode(''); }} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {(twoFaEnabled || config?.seguranca?.twoFactorEnabled) && (
              <button onClick={() => disable2FaMutation.mutate()} className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-4">
                Desativar 2FA
              </button>
            )}
          </div>

          {/* Seguranca Geral */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-bold text-white mb-4">Politicas de Seguranca</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">Timeout da sessao (min)</label>
                <input type="number" value={seguranca.sessionTimeout} onChange={(e) => setSeguranca({ ...seguranca, sessionTimeout: +e.target.value })} className="input-premium" min={5} max={480} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">Max tentativas de login</label>
                <input type="number" value={seguranca.maxLoginAttempts} onChange={(e) => setSeguranca({ ...seguranca, maxLoginAttempts: +e.target.value })} className="input-premium" min={3} max={20} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">Min caracteres senha</label>
                <input type="number" value={seguranca.passwordMinLength} onChange={(e) => setSeguranca({ ...seguranca, passwordMinLength: +e.target.value })} className="input-premium" min={6} max={32} />
              </div>
            </div>
            <button onClick={handleSaveSeguranca} className="btn-primary mt-4" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Politicas'}
            </button>
          </div>
        </div>
      )}

      {/* EMAIL SMTP */}
      {activeTab === 'email' && (
        <div className="card-premium p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Configuracao SMTP</h2>
          <p className="text-sm text-slate-400">Configure o servidor de envio de emails do sistema.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Host</label>
              <input type="text" value={smtpForm.host} onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })} className="input-premium" placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Porta</label>
              <input type="number" value={smtpForm.port} onChange={(e) => setSmtpForm({ ...smtpForm, port: +e.target.value })} className="input-premium" placeholder="587" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Usuario</label>
              <input type="text" value={smtpForm.user} onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })} className="input-premium" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Senha</label>
              <input type="password" value={smtpForm.pass} onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })} className="input-premium" placeholder="********" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Email Remetente</label>
              <input type="email" value={smtpForm.from} onChange={(e) => setSmtpForm({ ...smtpForm, from: e.target.value })} className="input-premium" placeholder="noreply@contaflow.com.br" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors w-full">
                <input type="checkbox" checked={smtpForm.secure} onChange={(e) => setSmtpForm({ ...smtpForm, secure: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">Conexao segura (TLS/SSL)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveSmtp} className="btn-primary" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Configuracoes'}
            </button>
            <button onClick={() => testSmtpMutation.mutate(smtpForm)} disabled={testSmtpMutation.isPending} className="px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-all">
              {testSmtpMutation.isPending ? 'Testando...' : 'Testar Conexao'}
            </button>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-base font-bold text-white mb-4">Notificacoes por Email</h3>
            <div className="space-y-3">
              {[
                { key: 'emailAlertas', label: 'Alertas de vencimento' },
                { key: 'emailRelatorios', label: 'Relatorios automaticos' },
                { key: 'pushVencimentos', label: 'Avisos de vencimentos proximos' },
                { key: 'pushObrigacoes', label: 'Lembretes de obrigacoes fiscais' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(notificacoes as any)[item.key]}
                    onChange={(e) => setNotificacoes({ ...notificacoes, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
            <button onClick={handleSaveNotificacoes} className="btn-primary mt-4" disabled={saveMutation.isPending}>
              Salvar Notificacoes
            </button>
          </div>
        </div>
      )}

      {/* BIOMETRIA */}
      {activeTab === 'biometria' && (
        <div className="card-premium p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Autenticacao Biometrica</h2>
          <p className="text-sm text-slate-400">Registre sua digital ou rosto para login rapido e seguro via WebAuthn.</p>

          <div className="flex gap-3 items-end">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Nome do Dispositivo</label>
              <input type="text" value={biometriaNome} onChange={(e) => setBiometriaNome(e.target.value)} className="input-premium" placeholder="Meu Notebook" />
            </div>
            <button onClick={handleRegisterBiometria} className="btn-primary">
              Registrar Biometria
            </button>
          </div>

          {biometriaDevices.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dispositivos Registrados</h3>
              {biometriaDevices.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{d.deviceName}</p>
                      <p className="text-xs text-slate-400">{new Date(d.criadoEm).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <button onClick={() => removeBiometriaMutation.mutate(d.id)} className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              <p className="text-slate-400 text-sm">Nenhum dispositivo biometrico registrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
