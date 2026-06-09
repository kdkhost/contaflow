import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircleIcon, XCircleIcon, ClockIcon, UsersIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';


export default function ESocialPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const { data: eventos, isLoading } = useQuery({
    queryKey: ['eventos-esocial'],
    queryFn: () => api.get('/pessoal/esocial/eventos').then((r) => r.data),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/pessoal/esocial/eventos/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos-esocial'] });
      notifySuccess('Evento excluido com sucesso!');
    },
    onError: () => {},
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACEITO': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'REJEITADO': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'ENVIADO': return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) return <Loading fullScreen />;

  const eventosList = eventos || [];
  const eventosFiltrados = eventosList.filter((e: any) =>
    e.status?.toLowerCase().includes(busca.toLowerCase()) ||
    e.competencia?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">eSocial</h1>

      <div className="card-premium p-4">
        <input
          type="text"
          placeholder="Buscar por status ou competencia..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-premium w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-500">{eventosList.filter((e: { status: string }) => e.status === 'PENDENTE').length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Enviados</p>
          <p className="text-2xl font-bold text-blue-500">{eventosList.filter((e: { status: string }) => e.status === 'ENVIADO').length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Aceitos</p>
          <p className="text-2xl font-bold text-green-500">{eventosList.filter((e: { status: string }) => e.status === 'ACEITO').length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Rejeitados</p>
          <p className="text-2xl font-bold text-red-500">{eventosList.filter((e: { status: string }) => e.status === 'REJEITADO').length}</p>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr><th>Tipo</th><th>Descricao</th><th>Competencia</th><th>Data Envio</th><th>Protocolo</th><th>Status</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {eventosFiltrados.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon={UsersIcon} title="Nenhum evento encontrado" /></td></tr>
            ) : (
              eventosFiltrados.map((evento: { id: string; tipo: string; descricao: string; competencia: string; dataEnvio: string; protocolo: string; status: string }) => (
                <tr key={evento.id}>
                  <td><span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500">{evento.tipo}</span></td>
                  <td>{evento.descricao}</td>
                  <td>{evento.competencia}</td>
                  <td>{evento.dataEnvio ? new Date(evento.dataEnvio).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="font-mono text-xs">{evento.protocolo || '-'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(evento.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        evento.status === 'ACEITO' ? 'bg-green-500/10 text-green-500' :
                        evento.status === 'REJEITADO' ? 'bg-red-500/10 text-red-500' :
                        evento.status === 'ENVIADO' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>{evento.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => excluirMutation.mutate(evento.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
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
