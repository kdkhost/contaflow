import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DropResult } from '@hello-pangea/dnd';
import { PlusIcon } from '@heroicons/react/24/outline';
import KanbanBoard, { KanbanColumn, KanbanItem } from '../../components/common/KanbanBoard';
import Modal, { ModalFooter } from '../../components/common/Modal';
import MaskedInput from '../../components/common/MaskedInput';
import { notifySuccess, notifyError } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ARQUIVADA';
  prioridade: 'low' | 'medium' | 'high';
  dataVencimento: string | null;
  responsavel: string | null;
}

const colunas: KanbanColumn[] = [
  { id: 'PENDENTE', title: 'Pendente', color: 'bg-yellow-500', items: [] },
  { id: 'EM_ANDAMENTO', title: 'Em Andamento', color: 'bg-blue-500', items: [] },
  { id: 'CONCLUIDA', title: 'Concluida', color: 'bg-green-500', items: [] },
  { id: 'ARQUIVADA', title: 'Arquivada', color: 'bg-gray-500', items: [] },
];

export default function KanbanPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    status: 'PENDENTE' as Tarefa['status'],
    prioridade: 'medium' as Tarefa['prioridade'],
    dataVencimento: '',
    responsavel: '',
  });

  const { data: tarefas, isLoading } = useQuery({
    queryKey: ['kanban-tarefas'],
    queryFn: () => api.get('/kanban/tarefas').then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/kanban/tarefas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-tarefas'] });
      setShowModal(false);
      resetForm();
      notifySuccess('Tarefa criada com sucesso!');
    },
    onError: () => notifyError('Erro ao criar tarefa'),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof formData> }) =>
      api.put(`/kanban/tarefas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-tarefas'] });
      notifySuccess('Tarefa atualizada com sucesso!');
    },
    onError: () => notifyError('Erro ao atualizar tarefa'),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/kanban/tarefas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-tarefas'] });
      notifySuccess('Tarefa excluida com sucesso!');
    },
    onError: () => notifyError('Erro ao excluir tarefa'),
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      status: 'PENDENTE',
      prioridade: 'medium',
      dataVencimento: '',
      responsavel: '',
    });
  };

  const tarefasList: Tarefa[] = tarefas?.tarefas || [];

  const kanbanColumns: KanbanColumn[] = colunas.map((col) => ({
    ...col,
    items: tarefasList
      .filter((t) => t.status === col.id)
      .map((t) => ({
        id: t.id,
        title: t.titulo,
        description: t.descricao,
        priority: t.prioridade,
        dueDate: t.dataVencimento ?? undefined,
        assignee: t.responsavel ?? undefined,
      })),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Tarefa['status'];

    atualizarMutation.mutate({
      id: draggableId,
      data: { status: newStatus },
    });
  };

  const handleItemClick = (item: KanbanItem) => {
    const tarefa = tarefasList.find((t) => t.id === item.id);
    if (tarefa) {
      setSelectedTarefa(tarefa);
      setFormData({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento || '',
        responsavel: tarefa.responsavel || '',
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await SwalDeleteConfirm();
    if (result.isConfirmed) {
      excluirMutation.mutate(id);
      setShowModal(false);
      setSelectedTarefa(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titulo) {
      notifyError('Titulo e obrigatorio');
      return;
    }

    if (selectedTarefa) {
      atualizarMutation.mutate({ id: selectedTarefa.id, data: formData });
    } else {
      criarMutation.mutate(formData);
    }
    setShowModal(false);
    setSelectedTarefa(null);
    resetForm();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Quadro Kanban</h1>
        <button
          onClick={() => { resetForm(); setSelectedTarefa(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Tarefa
        </button>
      </div>

      <KanbanBoard
        columns={kanbanColumns}
        onDragEnd={handleDragEnd}
        onItemClick={handleItemClick}
      />

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedTarefa(null); resetForm(); }}
        title={selectedTarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
              Titulo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Titulo da tarefa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
              Descricao
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
              placeholder="Descricao da tarefa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Tarefa['status'] })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDA">Concluida</option>
                <option value="ARQUIVADA">Arquivada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
                Prioridade
              </label>
              <select
                value={formData.prioridade}
                onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as Tarefa['prioridade'] })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MaskedInput
              mask="date"
              label="Data de Vencimento"
              value={formData.dataVencimento}
              onChange={(value) => setFormData({ ...formData, dataVencimento: value })}
              placeholder="DD/MM/AAAA"
            />
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">
                Responsavel
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nome do responsavel"
              />
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={() => { setShowModal(false); setSelectedTarefa(null); resetForm(); }}
          onConfirm={handleSubmit}
          confirmLabel={selectedTarefa ? 'Salvar' : 'Criar'}
          isLoading={criarMutation.isPending || atualizarMutation.isPending}
        />

        {selectedTarefa && (
          <div className="mt-4 pt-4 border-t dark:border-dark-border border-gray-200">
            <button
              onClick={() => handleDelete(selectedTarefa.id)}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Excluir tarefa
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
