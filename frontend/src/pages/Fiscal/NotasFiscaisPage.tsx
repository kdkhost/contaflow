import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentArrowUpIcon, DocumentCheckIcon, XCircleIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';
import { formatCurrencyFromNumber } from '../../utils/masks';

export default function NotasFiscaisPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const { data: notas, isLoading } = useQuery({
    queryKey: ['notas-fiscais'],
    queryFn: () => api.get('/fiscal/notas-fiscais').then((r) => r.data),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/fiscal/notas-fiscais/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      notifySuccess('Nota fiscal excluida com sucesso!');
    },
    onError: () => {},
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AUTORIZADA': return <DocumentCheckIcon className="w-5 h-5 text-green-500" />;
      case 'CANCELADA': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default: return <DocumentArrowUpIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (isLoading) return <Loading fullScreen />;

  const lista = notas?.data || notas || [];
  const listaFiltrada = lista.filter((n: any) =>
    n.status?.toLowerCase().includes(busca.toLowerCase()) ||
    n.tipoDocumento?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Notas Fiscais</h1>

      <div className="card-premium p-4">
        <input
          type="text"
          placeholder="Buscar por status ou tipo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-premium w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total</p>
          <p className="text-2xl font-bold dark:text-dark-text text-gray-800">{lista.length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Autorizadas</p>
          <p className="text-2xl font-bold text-green-500">{lista.filter((n: { status: string }) => n.status === 'AUTORIZADA').length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-500">{lista.filter((n: { status: string }) => n.status === 'PENDENTE').length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Canceladas</p>
          <p className="text-2xl font-bold text-red-500">{lista.filter((n: { status: string }) => n.status === 'CANCELADA').length}</p>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr><th>Chave de Acesso</th><th>Numero</th><th>Emitente</th><th>Data</th><th>Valor</th><th>Status</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon={DocumentTextIcon} title="Nenhuma nota fiscal encontrada" /></td></tr>
            ) : (
              listaFiltrada.map((nota: { id: string; chaveAcesso: string; numero: string; razaoSocialEmitente: string; dataEmissao: string; valorTotal: number; status: string }) => (
                <tr key={nota.id}>
                  <td className="font-mono text-xs">{nota.chaveAcesso?.slice(0, 20)}...</td>
                  <td>{nota.numero}</td>
                  <td>{nota.razaoSocialEmitente}</td>
                  <td>{new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}</td>
                  <td className="font-medium">{formatCurrencyFromNumber(nota.valorTotal)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(nota.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        nota.status === 'AUTORIZADA' ? 'bg-green-500/10 text-green-500' :
                        nota.status === 'CANCELADA' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>{nota.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => excluirMutation.mutate(nota.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
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
    </div>
  );
}
