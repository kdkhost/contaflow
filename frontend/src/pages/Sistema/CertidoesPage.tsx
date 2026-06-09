import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheckIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { SwalSuccess, SwalError } from '../../utils/swal';

interface Certidao {
  id: string;
  tipo: string;
  descricao: string;
  status: string;
  dataEmissao: string | null;
  dataValidade: string | null;
  numero: string | null;
}

const statusColors: Record<string, string> = {
  POSITIVA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  NEGATIVA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  PENDENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  EM_ANALISE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const tipoLabels: Record<string, string> = {
  CND_FEDERAL: 'CND Federal',
  CND_TRABALHISTA: 'CND Trabalhista',
  CND_PREVIDenciaria: 'CND Previdenciaria',
  CERTIDAO_NEGATIVA_DEBITOS: 'Certidao Negativa de Debitos',
  CERTIDAOPOSITIVA_EFEITOS_NEGATIVOS: 'Certidao Positiva com Efeitos de Negativa',
};

export default function CertidoesPage() {
  const queryClient = useQueryClient();

  const { data: certidoes, isLoading } = useQuery({
    queryKey: ['certidoes'],
    queryFn: () => api.get('/integracoes/certidoes-conjuntas').then((r) => r.data),
  });

  const consultarMutation = useMutation({
    mutationFn: () => api.post('/integracoes/certidoes-conjuntas'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certidoes'] });
      SwalSuccess('Certidoes consultadas com sucesso!');
    },
    onError: () => SwalError('Erro ao consultar certidoes'),
  });

  if (isLoading) return <Loading />;

  const certidoesList: Certidao[] = certidoes?.certidoes || [];
  const positivas = certidoesList.filter((c) => c.status === 'POSITIVA');
  const pendentes = certidoesList.filter((c) => c.status === 'PENDENTE' || c.status === 'EM_ANALISE');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Certidoes</h1>
        <button
          onClick={() => consultarMutation.mutate()}
          disabled={consultarMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-5 h-5 ${consultarMutation.isPending ? 'animate-spin' : ''}`} />
          {consultarMutation.isPending ? 'Consultando...' : 'Consultar Todas'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Positivas</p>
              <p className="text-2xl font-bold dark:text-dark-text text-gray-800">{positivas.length}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <ShieldCheckIcon className="w-6 h-6 text-yellow-500" />
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
              <XCircleIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Negativas</p>
              <p className="text-2xl font-bold dark:text-dark-text text-gray-800">
                {certidoesList.filter((c) => c.status === 'NEGATIVA').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b dark:border-dark-border border-gray-200">
          <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">Certidoes Conjuntas</h3>
        </div>
        <div className="overflow-x-auto">
          {certidoesList.length === 0 ? (
            <EmptyState icon={ShieldCheckIcon} message="Nenhuma certidao encontrada. Clique em Consultar Todas para buscar." />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-dark-border border-gray-200">
                  <th className="text-left p-4 text-sm font-medium dark:text-dark-text-secondary text-gray-500">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium dark:text-dark-text-secondary text-gray-500">Descricao</th>
                  <th className="text-left p-4 text-sm font-medium dark:text-dark-text-secondary text-gray-500">Numero</th>
                  <th className="text-left p-4 text-sm font-medium dark:text-dark-text-secondary text-gray-500">Emissao</th>
                  <th className="text-left p-4 text-sm font-medium dark:text-dark-text-secondary text-gray-500">Validade</th>
                  <th className="text-left p-4 text-sm font-medium dark:text-dark-text-secondary text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {certidoesList.map((certidao) => (
                  <tr key={certidao.id} className="border-b dark:border-dark-border border-gray-100 hover:bg-gray-50 dark:hover:bg-dark-tertiary transition-colors">
                    <td className="p-4 text-sm font-medium dark:text-dark-text text-gray-800">
                      {tipoLabels[certidao.tipo] || certidao.tipo}
                    </td>
                    <td className="p-4 text-sm dark:text-dark-text-secondary text-gray-500">{certidao.descricao}</td>
                    <td className="p-4 text-sm dark:text-dark-text text-gray-800">{certidao.numero || '-'}</td>
                    <td className="p-4 text-sm dark:text-dark-text text-gray-800">
                      {certidao.dataEmissao ? new Date(certidao.dataEmissao).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-4 text-sm dark:text-dark-text text-gray-800">
                      {certidao.dataValidade ? new Date(certidao.dataValidade).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[certidao.status] || 'bg-gray-100 text-gray-800'}`}>
                        {certidao.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
