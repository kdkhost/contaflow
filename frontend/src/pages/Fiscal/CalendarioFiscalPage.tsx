import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, ExclamationTriangleIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import ContaFlowCalendar from '../../components/common/ContaFlowCalendar';
import Modal, { ModalFooter } from '../../components/common/Modal';
import { notifySuccess, notifyError } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';

interface ObrigacaoFiscal {
  id: string;
  tipo: string;
  descricao: string;
  dataVencimento: string;
  status: string;
  periodo: string;
}

const tipoColors: Record<string, string> = {
  ICMS: '#ef4444',
  ISS: '#f59e0b',
  PIS: '#10b981',
  COFINS: '#3b82f6',
  IRPJ: '#8b5cf6',
  CSLL: '#ec4899',
  INSS: '#06b6d4',
  FGTS: '#84cc16',
};

export default function CalendarioFiscalPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedObrigacao, setSelectedObrigacao] = useState<ObrigacaoFiscal | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'ICMS',
    descricao: '',
    dataVencimento: '',
    periodo: '',
  });

  const { data: obrigacoes, isLoading } = useQuery({
    queryKey: ['calendario-fiscal'],
    queryFn: () => api.get('/fiscal/obrigacoes').then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/fiscal/obrigacoes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendario-fiscal'] });
      setShowModal(false);
      resetForm();
      notifySuccess('Obrigacao criada com sucesso!');
    },
    onError: () => notifyError('Erro ao criar obrigacao'),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof formData> }) =>
      api.put(`/fiscal/obrigacoes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendario-fiscal'] });
      setShowModal(false);
      setSelectedObrigacao(null);
      resetForm();
      notifySuccess('Obrigacao atualizada com sucesso!');
    },
    onError: () => notifyError('Erro ao atualizar obrigacao'),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/fiscal/obrigacoes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendario-fiscal'] });
      notifySuccess('Obrigacao excluida com sucesso!');
    },
    onError: () => notifyError('Erro ao excluir obrigacao'),
  });

  const resetForm = () => {
    setFormData({ tipo: 'ICMS', descricao: '', dataVencimento: '', periodo: '' });
  };

  const obrigacoesList: ObrigacaoFiscal[] = obrigacoes?.obrigacoes || [];
  const pendentes = obrigacoesList.filter((o) => o.status === 'PENDENTE');
  const atrasadas = obrigacoesList.filter((o) => o.status === 'ATRASADO');
  const pagas = obrigacoesList.filter((o) => o.status === 'PAGO' || o.status === 'ENVIADO');

  const calendarEvents = obrigacoesList.map((o) => ({
    id: o.id,
    title: `${o.tipo} - ${o.descricao}`,
    start: o.dataVencimento,
    color: tipoColors[o.tipo] || '#6366f1',
    extendedProps: { ...o },
  }));

  const handleEventClick = (event: { id: string; extendedProps?: Record<string, unknown> }) => {
    const obrigacao = event.extendedProps as unknown as ObrigacaoFiscal;
    setSelectedObrigacao(obrigacao);
    setFormData({
      tipo: obrigacao.tipo,
      descricao: obrigacao.descricao,
      dataVencimento: obrigacao.dataVencimento.split('T')[0],
      periodo: obrigacao.periodo,
    });
    setShowModal(true);
  };

  const handleDateClick = (info: { date: Date }) => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      dataVencimento: info.date.toISOString().split('T')[0],
    }));
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await SwalDeleteConfirm();
    if (result.isConfirmed) {
      excluirMutation.mutate(id);
    }
  };

  const handleSubmit = async () => {
    if (!formData.descricao || !formData.dataVencimento) {
      notifyError('Preencha todos os campos obrigatorios');
      return;
    }

    if (selectedObrigacao) {
      atualizarMutation.mutate({ id: selectedObrigacao.id, data: formData });
    } else {
      criarMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Calendario Fiscal</h1>
        <button
          onClick={() => { resetForm(); setSelectedObrigacao(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Obrigacao
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <CalendarIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold dark:text-dark-text text-gray-800">{pendentes.length}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/10">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Atrasadas</p>
              <p className="text-2xl font-bold dark:text-dark-text text-gray-800">{atrasadas.length}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Quitadas</p>
              <p className="text-2xl font-bold dark:text-dark-text text-gray-800">{pagas.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <ContaFlowCalendar
          events={calendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          height="600px"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedObrigacao ? 'Editar Obrigacao' : 'Nova Obrigacao'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ICMS">ICMS</option>
              <option value="ISS">ISS</option>
              <option value="PIS">PIS</option>
              <option value="COFINS">COFINS</option>
              <option value="IRPJ">IRPJ</option>
              <option value="CSLL">CSLL</option>
              <option value="INSS">INSS</option>
              <option value="FGTS">FGTS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
              Descricao <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descricao da obrigacao"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
                Data de Vencimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
                Periodo
              </label>
              <input
                type="text"
                value={formData.periodo}
                onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="MM/AAAA"
              />
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={() => setShowModal(false)}
          onConfirm={handleSubmit}
          confirmLabel={selectedObrigacao ? 'Salvar' : 'Criar'}
          isLoading={criarMutation.isPending || atualizarMutation.isPending}
        />

        {selectedObrigacao && (
          <div className="mt-4 pt-4 border-t dark:border-dark-border border-gray-200">
            <button
              onClick={() => handleDelete(selectedObrigacao.id)}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Excluir obrigacao
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
