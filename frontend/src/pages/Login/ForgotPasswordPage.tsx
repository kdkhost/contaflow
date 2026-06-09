import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { notifySuccess, notifyError } from '../../utils/notify';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      setStep('code');
      notifySuccess('Codigo enviado para seu email!');
    } catch {
      notifyError('Email nao encontrado no sistema.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
      notifySuccess('Senha redefinida com sucesso! Faca login.');
      setSent(false);
      setStep('email');
    } catch {
      notifyError('Codigo invalido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h1 className="text-5xl font-black text-gradient mb-2">ContaFlow</h1>
          <p className="text-slate-400 text-sm">
            {step === 'email' ? 'Recuperar Senha' : 'Redefinir Senha'}
          </p>
        </div>

        <div className="card-premium p-8">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <p className="text-sm text-slate-400 text-center">
                Informe o email associado a sua conta e enviaremos um codigo de verificacao.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Enviando...
                  </span>
                ) : 'Enviar Codigo'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <p className="text-sm text-slate-400 text-center">
                Digite o codigo recebido e sua nova senha.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Codigo de Verificacao</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input-premium text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-premium"
                  placeholder="Minimo 8 caracteres"
                  minLength={8}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
              <button type="button" onClick={() => { setStep('email'); setSent(false); }} className="w-full text-sm text-slate-400 hover:text-white transition-colors text-center py-2">
                Voltar
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link to="/" className="text-sm text-slate-400 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
