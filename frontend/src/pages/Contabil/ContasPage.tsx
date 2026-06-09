import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Modal, { ModalFooter } from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess, notifyError } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';

interface ContaContabil {
  id: string;
  codigo: string;
  descricao: string;
  tipo: string;
  natureza: string;
  aceitaLancamento: boolean;
  nivel: number;
}

const initialForm = { codigo: '', descricao: '', tipo: 'ATIVO', natureza: 'AMBOS', aceitaLancamento: false };

export default function ContasPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<ContaContabil | null>(null);
  const [form, setForm] = useState(initialForm);

  const { data: contas, isLoading } = useQuery({
    queryKey: ['contas'],
    queryFn: () => api.get('/contabil/contas').then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/contabil/contas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
      notifySuccess('Conta criada com sucesso!');
      setShowModal(false);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao criar conta'),
  });

  const atualizarMutation = useMutation({
    mutationFn: (data: typeof form) => api.put(`/contabil/contas/${editando?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
      notifySuccess('Conta atualizada com sucesso!');
      setShowModal(false);
      setEditando(null);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao atualizar conta'),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/contabil/contas/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
      notifySuccess('Conta excluida com sucesso!');
    },
    onError: () => {},
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editando) atualizarMutation.mutate(form);
    else criarMutation.mutate(form);
  };

  const contasFiltradas = contas?.filter((c: ContaContabil) =>
    c.codigo.toLowerCase().includes(busca.toLowerCase()) || c.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      ATIVO: 'bg-blue-500/10 text-blue-500', PASSIVO: 'bg-red-500/10 text-red-500',
      PATRIMONIO_LIQUIDO: 'bg-purple-500/10 text-purple-500', RECEITA: 'bg-green-500/10 text-green-500',
      DESPESA: 'bg-orange-500/10 text-orange-500', CUSTO: 'bg-yellow-500/10 text-yellow-500',
    };
    return colors[tipo] || 'bg-gray-500/10 text-gray-500';
  };

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Plano de Contas</h1>
        <button onClick={() => { setEditando(null); setForm(initialForm); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Nova Conta
        </button>
      </div>

      <div className="card-premium p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 dark:text-dark-text-secondary text-gray-400" />
          <input type="text" placeholder="Buscar por codigo ou descricao..." value={busca} onChange={(e) => setBusca(e.target.value)} className="input-premium pl-10" />
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr><th>Codigo</th><th>Descricao</th><th>Tipo</th><th>Natureza</th><th>Nivel</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {!contasFiltradas || contasFiltradas.length === 0 ? (
              <tr><td colSpan={6}><EmptyState icon={CalculatorIcon} title="Nenhuma conta encontrada" /></td></tr>
            ) : (
              contasFiltradas.map((conta: ContaContabil) => (
                <tr key={conta.id}>
                  <td className="font-mono font-medium">{conta.codigo}</td>
                  <td>{conta.descricao}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(conta.tipo)}`}>{conta.tipo.replace('_', ' ')}</span></td>
                  <td>{conta.natureza}</td>
                  <td>{conta.nivel}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditando(conta); setForm({ codigo: conta.codigo, descricao: conta.descricao, tipo: conta.tipo, natureza: conta.natureza, aceitaLancamento: conta.aceitaLancamento }); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-primary-500/10 text-primary-500 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => excluirMutation.mutate(conta.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditando(null); }} title={editando ? 'Editar Conta' : 'Nova Conta'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Codigo <span className="text-red-500">*</span></label>
            <input type="text" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} className="input-premium font-mono" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Descricao <span className="text-red-500">*</span></label>
            <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="input-premium" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="input-premium">
                <option value="ATIVO">Ativo</option><option value="PASSIVO">Passivo</option>
                <option value="PATRIMONIO_LIQUIDO">Patrimonio Liquido</option><option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option><option value="CUSTO">Custo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Natureza</label>
              <select value={form.natureza} onChange={(e) => setForm({ ...form, natureza: e.target.value })} className="input-premium">
                <option value="DEBITO">Debito</option><option value="CREDITO">Credito</option><option value="AMBOS">Ambos</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.aceitaLancamento} onChange={(e) => setForm({ ...form, aceitaLancamento: e.target.checked })} className="w-4 h-4 rounded" />
            <label className="text-sm dark:text-dark-text text-gray-700">Aceita Lancamento</label>
          </div>
          <ModalFooter onCancel={() => { setShowModal(false); setEditando(null); }} onConfirm={handleSubmit} confirmLabel={editando ? 'Salvar' : 'Criar'} isLoading={criarMutation.isPending || atualizarMutation.isPending} />
        </form>
      </Modal>
    </div>
  );
}
