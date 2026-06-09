import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, FunnelIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Modal, { ModalFooter } from '../../components/common/Modal';
import MaskedInput from '../../components/common/MaskedInput';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess, notifyError } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';
import { parseCurrencyToNumber, formatCurrencyFromNumber } from '../../utils/masks';

const initialForm = {
  dataLancamento: new Date().toISOString().split('T')[0],
  dataContabil: new Date().toISOString().split('T')[0],
  descricao: '',
  valor: '0,00',
  tipo: 'DEBITO',
  contaContabilId: '',
  competencia: new Date().toISOString().slice(0, 7),
};

export default function LancamentosPage() {
  const queryClient = useQueryClient();
  const [competencia, setCompetencia] = useState(new Date().toISOString().slice(0, 7));
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [form, setForm] = useState(initialForm);
  const [busca, setBusca] = useState('');

  const { data: contas } = useQuery({
    queryKey: ['contas'],
    queryFn: () => api.get('/contabil/contas').then((r) => r.data),
  });

  const { data: lancamentos, isLoading } = useQuery({
    queryKey: ['lancamentos', competencia],
    queryFn: () => api.get(`/contabil/lancamentos?competencia=${competencia}`).then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/contabil/lancamentos', { ...data, valor: parseCurrencyToNumber(data.valor) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      notifySuccess('Lancamento criado com sucesso!');
      setShowModal(false);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao criar lancamento'),
  });

  const atualizarMutation = useMutation({
    mutationFn: (data: any) => api.put(`/contabil/lancamentos/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      notifySuccess('Lancamento atualizado com sucesso!');
      setShowModal(false);
      setEditando(null);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao atualizar lancamento'),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/contabil/lancamentos/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      notifySuccess('Lancamento excluido com sucesso!');
    },
    onError: () => {},
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editando) {
      atualizarMutation.mutate({ id: editando.id, ...form, valor: parseCurrencyToNumber(form.valor) });
    } else {
      criarMutation.mutate(form);
    }
  };

  const openEdit = (lancamento: any) => {
    setEditando(lancamento);
    setForm({
      dataLancamento: lancamento.dataLancamento?.split('T')[0] || '',
      dataContabil: lancamento.dataContabil?.split('T')[0] || '',
      descricao: lancamento.descricao,
      valor: lancamento.valor ? formatCurrencyFromNumber(lancamento.valor) : '0,00',
      tipo: lancamento.tipo,
      contaContabilId: lancamento.contaContabilId || '',
      competencia: lancamento.competencia || '',
    });
    setShowModal(true);
  };

  const contasAceitas = contas?.filter((c: { aceitaLancamento: boolean }) => c.aceitaLancamento);
  const lista = lancamentos?.data || lancamentos || [];
  const listaFiltrada = lista.filter((l: any) =>
    l.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    l.status?.toLowerCase().includes(busca.toLowerCase())
  );

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Lancamentos Contabeis</h1>
        <button onClick={() => { setEditando(null); setForm(initialForm); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Novo Lancamento
        </button>
      </div>

      <div className="card-premium p-4 flex items-center gap-4">
        <FunnelIcon className="w-5 h-5 dark:text-dark-text-secondary text-gray-400" />
        <label className="text-sm dark:text-dark-text text-gray-700">Competencia:</label>
        <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className="input-premium w-48" />
        <input
          type="text"
          placeholder="Buscar por descricao ou status..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-premium flex-1"
        />
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr><th>Data</th><th>Descricao</th><th>Conta</th><th>Tipo</th><th>Valor</th><th>Status</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon={DocumentTextIcon} title="Nenhum lancamento encontrado" /></td></tr>
            ) : (
              listaFiltrada.map((l: { id: string; dataLancamento: string; descricao: string; tipo: string; valor: number; status: string; contaContabil?: { codigo: string; descricao: string } }) => (
                <tr key={l.id}>
                  <td>{new Date(l.dataLancamento).toLocaleDateString('pt-BR')}</td>
                  <td>{l.descricao}</td>
                  <td className="font-mono text-sm">{l.contaContabil?.codigo} - {l.contaContabil?.descricao}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-medium ${l.tipo === 'DEBITO' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{l.tipo === 'DEBITO' ? 'Debito' : 'Credito'}</span></td>
                  <td className="font-medium">{formatCurrencyFromNumber(l.valor)}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-medium ${l.status === 'CONFIRMADO' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{l.status}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-primary-500/10 text-primary-500 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => excluirMutation.mutate(l.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditando(null); }} title={editando ? 'Editar Lancamento' : 'Novo Lancamento'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MaskedInput mask="date" label="Data Lancamento" value={form.dataLancamento} onChange={(v) => setForm({ ...form, dataLancamento: v })} placeholder="DD/MM/AAAA" required />
            <MaskedInput mask="date" label="Competencia" value={form.competencia} onChange={(v) => setForm({ ...form, competencia: v })} placeholder="MM/AAAA" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Descricao <span className="text-red-500">*</span></label>
            <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="input-premium" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Conta Contabil <span className="text-red-500">*</span></label>
            <select value={form.contaContabilId} onChange={(e) => setForm({ ...form, contaContabilId: e.target.value })} className="input-premium" required>
              <option value="">Selecione...</option>
              {contasAceitas?.map((c: { id: string; codigo: string; descricao: string }) => (
                <option key={c.id} value={c.id}>{c.codigo} - {c.descricao}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="input-premium">
                <option value="DEBITO">Debito</option><option value="CREDITO">Credito</option>
              </select>
            </div>
            <MaskedInput mask="currency" label="Valor" value={form.valor} onChange={(v) => setForm({ ...form, valor: v })} placeholder="0,00" required />
          </div>
          <ModalFooter onCancel={() => { setShowModal(false); setEditando(null); }} onConfirm={handleSubmit} isLoading={criarMutation.isPending || atualizarMutation.isPending} />
        </form>
      </Modal>
    </div>
  );
}
