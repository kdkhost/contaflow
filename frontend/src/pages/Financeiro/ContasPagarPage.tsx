import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, CheckIcon, TrashIcon, BanknotesIcon, PencilIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Modal, { ModalFooter } from '../../components/common/Modal';
import MaskedInput from '../../components/common/MaskedInput';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess, notifyError } from '../../utils/notify';
import { SwalConfirm, SwalDeleteConfirm } from '../../utils/swal';
import { parseCurrencyToNumber, formatCurrencyFromNumber } from '../../utils/masks';

interface ContaPagar {
  id: string;
  descricao: string;
  fornecedor: string;
  valor: number;
  dataVencimento: string;
  status: string;
  formaPagamento: string;
}

const initialForm = { descricao: '', fornecedor: '', valor: '0,00', dataVencimento: '', formaPagamento: 'PIX' };

export default function ContasPagarPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<ContaPagar | null>(null);
  const [form, setForm] = useState(initialForm);
  const [busca, setBusca] = useState('');

  const { data: contas, isLoading } = useQuery({
    queryKey: ['contas-pagar'],
    queryFn: () => api.get('/financeiro/pagar').then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/financeiro/pagar', { ...data, valor: parseCurrencyToNumber(data.valor) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-pagar'] });
      notifySuccess('Conta criada com sucesso!');
      setShowModal(false);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao criar conta'),
  });

  const atualizarMutation = useMutation({
    mutationFn: (data: any) => api.put(`/financeiro/pagar/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-pagar'] });
      notifySuccess('Conta atualizada com sucesso!');
      setShowModal(false);
      setEditando(null);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao atualizar conta'),
  });

  const pagarMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalConfirm('Confirmar pagamento', 'Deseja marcar esta conta como paga?');
      if (result.isConfirmed) {
        return api.post(`/financeiro/pagar/${id}/pagar`, { dataPagamento: new Date().toISOString(), formaPagamento: 'PIX' });
      }
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-pagar'] });
      notifySuccess('Conta paga com sucesso!');
    },
    onError: () => {},
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/financeiro/pagar/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-pagar'] });
      notifySuccess('Conta excluida com sucesso!');
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

  const openEdit = (conta: ContaPagar) => {
    setEditando(conta);
    setForm({
      descricao: conta.descricao,
      fornecedor: conta.fornecedor || '',
      valor: conta.valor ? formatCurrencyFromNumber(conta.valor) : '0,00',
      dataVencimento: conta.dataVencimento?.split('T')[0] || '',
      formaPagamento: (conta as any).formaPagamento || 'PIX',
    });
    setShowModal(true);
  };

  const lista: ContaPagar[] = contas?.data || contas || [];
  const listaFiltrada = lista.filter((c: ContaPagar) =>
    c.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    c.status?.toLowerCase().includes(busca.toLowerCase())
  );

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Contas a Pagar</h1>
        <button onClick={() => { setEditando(null); setForm(initialForm); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Nova Conta
        </button>
      </div>

      <div className="card-premium p-4">
        <input
          type="text"
          placeholder="Buscar por descricao ou status..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-premium w-full"
        />
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Descricao</th>
              <th>Fornecedor</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr><td colSpan={6}><EmptyState icon={BanknotesIcon} title="Nenhuma conta encontrada" description="Crie uma nova conta a pagar" /></td></tr>
            ) : (
              listaFiltrada.map((conta: ContaPagar) => (
                <tr key={conta.id}>
                  <td className="font-medium">{conta.descricao}</td>
                  <td>{conta.fornecedor}</td>
                  <td className="font-medium">{formatCurrencyFromNumber(conta.valor)}</td>
                  <td>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conta.status === 'PAGO' ? 'bg-green-500/10 text-green-500' :
                      conta.status === 'ATRASADO' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>{conta.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(conta)} className="p-1.5 rounded-lg hover:bg-primary-500/10 text-primary-500 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {conta.status === 'PENDENTE' && (
                        <button onClick={() => pagarMutation.mutate(conta.id)} className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-500 transition-colors" title="Marcar como pago">
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => excluirMutation.mutate(conta.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditando(null); }} title={editando ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Descricao <span className="text-red-500">*</span></label>
            <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="input-premium" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Fornecedor</label>
            <input type="text" value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} className="input-premium" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MaskedInput mask="currency" label="Valor" value={form.valor} onChange={(v) => setForm({ ...form, valor: v })} placeholder="0,00" required />
            <MaskedInput mask="date" label="Vencimento" value={form.dataVencimento} onChange={(v) => setForm({ ...form, dataVencimento: v })} placeholder="DD/MM/AAAA" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Forma de Pagamento</label>
            <select value={form.formaPagamento} onChange={(e) => setForm({ ...form, formaPagamento: e.target.value })} className="input-premium">
              <option value="PIX">PIX</option>
              <option value="BOLETO">Boleto</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="CARTAO">Cartao</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
          <ModalFooter onCancel={() => { setShowModal(false); setEditando(null); }} onConfirm={handleSubmit} isLoading={criarMutation.isPending || atualizarMutation.isPending} />
        </form>
      </Modal>
    </div>
  );
}
