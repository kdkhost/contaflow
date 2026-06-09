import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess } from '../../utils/notify';

interface Notificacao {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  createdAt: string;
}

const tipoIcons: Record<string, typeof BellIcon> = {
  INFO: InformationCircleIcon,
  WARNING: ExclamationTriangleIcon,
  SUCCESS: CheckCircleIcon,
  ERROR: ExclamationTriangleIcon,
};

const tipoColors: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  ERROR: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function NotificacoesPage() {
  const queryClient = useQueryClient();
  const { data: notificacoes, isLoading } = useQuery({
    queryKey: ['notificacoes'],
    queryFn: () => api.get('/dashboard/notificacoes').then((r) => r.data),
  });

  const marcarLidaMutation = useMutation({
    mutationFn: (id: string) => api.put(`/dashboard/notificacoes/${id}/lida`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
      notifySuccess('Notificacao marcada como lida!');
    },
    onError: () => {},
  });

  if (isLoading) return <Loading />;

  const notificacoesList: Notificacao[] = notificacoes?.notificacoes || [];
  const naoLidas = notificacoesList.filter((n) => !n.lida);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Notificacoes</h1>
        {naoLidas.length > 0 && (
          <span className="px-3 py-1 text-sm font-medium bg-primary-500 text-white rounded-full">
            {naoLidas.length} nao lida{naoLidas.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notificacoesList.length === 0 ? (
          <EmptyState icon={BellIcon} message="Nenhuma notificacao" />
        ) : (
          notificacoesList.map((notificacao) => {
            const Icon = tipoIcons[notificacao.tipo] || BellIcon;
            return (
              <div
                key={notificacao.id}
                className={`card-premium p-4 flex items-start gap-4 transition-colors ${
                  !notificacao.lida ? 'border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${tipoColors[notificacao.tipo] || 'bg-gray-100 text-gray-800'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${!notificacao.lida ? 'dark:text-dark-text text-gray-800' : 'dark:text-dark-text-secondary text-gray-500'}`}>
                      {notificacao.titulo}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs dark:text-dark-text-secondary text-gray-400">
                        {new Date(notificacao.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {!notificacao.lida && (
                        <button
                          onClick={() => marcarLidaMutation.mutate(notificacao.id)}
                          className="p-1 rounded-lg hover:bg-green-500/10 text-green-500 transition-colors"
                          title="Marcar como lida"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm dark:text-dark-text-secondary text-gray-500 mt-1">
                    {notificacao.mensagem}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
