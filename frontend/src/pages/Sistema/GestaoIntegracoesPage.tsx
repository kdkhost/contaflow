import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PuzzlePieceIcon, PlusIcon, CheckCircleIcon, XCircleIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { SwalSuccess, SwalError } from '../../utils/swal';
import { SwalDeleteConfirm } from '../../utils/swal';

interface Integracao {
  id: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  ultimaSincronizacao: string | null;
  status: string;
}

const tipoLabels: Record<string, string> = {
  ESOCIAL: 'eSocial',
  NFE: 'NF-e',
  NFSE: 'NFS-e',
  SPED: 'SPED',
  EFD: 'EFD/ECF',
  CERTIDAO: 'Certidoes',
};

export default function GestaoIntegracoesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nome: '', tipo: 'ESOCIAL' });

  const { data: integracoes, isLoading } = useQuery({
    queryKey: ['integracoes'],
    queryFn: () => api.get('/integracoes').then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/integracoes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes'] });
      setShowModal(false);
      setFormData({ nome: '', tipo: 'ESOCIAL' });
      SwalSuccess('Integracao criada com sucesso!');
    },
    onError: () => SwalError('Erro ao criar integracao'),
  });

  const executarMutation = useMutation({
    mutationFn: (id: string) => api.post(`/integracoes/${id}/executar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes'] });
      SwalSuccess('Integracao executada com sucesso!');
    },
    onError: () => SwalError('Erro ao executar integracao'),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/integracoes/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes'] });
      SwalSuccess('Integracao excluida com sucesso!');
    },
    onError: () => {},
  });

  if (isLoading) return <Loading />;

  const integracoesList: Integracao[] = integracoes?.integracoes || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Gestao de Integracoes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Integracao
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integracoesList.length === 0 ? (
          <EmptyState icon={PuzzlePieceIcon} message="Nenhuma integracao configurada" />
        ) : (
          integracoesList.map((integracao) => (
            <div key={integracao.id} className="card-premium p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">{integracao.nome}</h3>
                  <p className="text-sm dark:text-dark-text-secondary text-gray-500">{tipoLabels[integracao.tipo] || integracao.tipo}</p>
                </div>
                <div className={`p-2 rounded-lg ${integracao.ativo ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-dark-tertiary'}`}>
                  {integracao.ativo ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="dark:text-dark-text-secondary text-gray-500">Status:</span>
                  <span className={`font-medium ${integracao.status === 'CONECTADO' ? 'text-green-500' : 'text-gray-500'}`}>
                    {integracao.status}
                  </span>
                </div>
                {integracao.ultimaSincronizacao && (
                  <div className="flex justify-between text-sm">
                    <span className="dark:text-dark-text-secondary text-gray-500">Ultima sincronizacao:</span>
                    <span className="dark:text-dark-text text-gray-800">
                      {new Date(integracao.ultimaSincronizacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => executarMutation.mutate(integracao.id)}
                disabled={!integracao.ativo || executarMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-500 rounded-lg hover:bg-primary-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="w-4 h-4" />
                {executarMutation.isPending ? 'Executando...' : 'Executar'}
              </button>
              <button
                onClick={() => excluirMutation.mutate(integracao.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-premium p-6 w-full max-w-md">
            <h2 className="text-xl font-bold dark:text-dark-text text-gray-800 mb-4">Nova Integracao</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: eSocial Producao"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border dark:border-dark-border border-gray-300 dark:bg-dark-secondary bg-white dark:text-dark-text text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ESOCIAL">eSocial</option>
                  <option value="NFE">NF-e</option>
                  <option value="NFSE">NFS-e</option>
                  <option value="SPED">SPED</option>
                  <option value="EFD">EFD/ECF</option>
                  <option value="CERTIDAO">Certidoes</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border dark:border-dark-border border-gray-300 rounded-lg dark:text-dark-text text-gray-800 hover:bg-gray-50 dark:hover:bg-dark-tertiary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => criarMutation.mutate(formData)}
                disabled={!formData.nome || criarMutation.isPending}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {criarMutation.isPending ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
