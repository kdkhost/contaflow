import { useQuery } from '@tanstack/react-query';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  DocumentTextIcon, UsersIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { formatCurrencyFromNumber } from '../../utils/masks';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend
);

export default function DashboardPage() {
  const { data: resumo, isLoading } = useQuery({
    queryKey: ['dashboard-resumo'],
    queryFn: () => api.get('/dashboard/resumo').then((r) => r.data),
  });

  if (isLoading) return <Loading />;

  const cards = [
    { label: 'Funcionarios Ativos', value: resumo?.funcionariosAtivos || 0, icon: UsersIcon, color: 'blue' },
    { label: 'Contas a Pagar', value: formatCurrencyFromNumber(resumo?.contasAPagar?.valor || 0), icon: ArrowTrendingDownIcon, color: 'red' },
    { label: 'Contas a Receber', value: formatCurrencyFromNumber(resumo?.contasAReceber?.valor || 0), icon: ArrowTrendingUpIcon, color: 'green' },
    { label: 'Notas Fiscais', value: resumo?.totalNotasFiscais || 0, icon: DocumentTextIcon, color: 'purple' },
  ];

  const fluxoCaixaData = {
    labels: ['Entradas', 'Saidas', 'Saldo'],
    datasets: [
      {
        data: [
          Number(resumo?.fluxoCaixa?.entradas || 0),
          Number(resumo?.fluxoCaixa?.saidas || 0),
          Number(resumo?.fluxoCaixa?.saldo || 0),
        ],
        backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'],
      },
    ],
  };

  const evolucaoData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
      },
      {
        label: 'Despesas',
        data: [8000, 12000, 10000, 15000, 13000, 18000],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm dark:text-dark-text-secondary text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold dark:text-dark-text text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-500/10`}>
                <card.icon className={`w-6 h-6 text-${card.color}-500`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800 mb-4">Fluxo de Caixa</h3>
          <div className="h-64">
            <Doughnut data={fluxoCaixaData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800 mb-4">Evolucao Mensal</h3>
          <div className="h-64">
            <Line data={evolucaoData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800 mb-4">Indicadores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-dark-border" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="37.68" className="text-primary-500" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold dark:text-dark-text">85%</span>
            </div>
            <p className="mt-2 text-sm dark:text-dark-text-secondary text-gray-600">Eficiencia Operacional</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-dark-border" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="18.84" className="text-green-500" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold dark:text-dark-text">92%</span>
            </div>
            <p className="mt-2 text-sm dark:text-dark-text-secondary text-gray-600">Compliance</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-dark-border" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="62.8" className="text-yellow-500" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold dark:text-dark-text">75%</span>
            </div>
            <p className="mt-2 text-sm dark:text-dark-text-secondary text-gray-600">Automacao</p>
          </div>
        </div>
      </div>
    </div>
  );
}
