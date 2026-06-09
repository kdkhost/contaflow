import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { formatCurrencyFromNumber } from '../../utils/masks';

export default function FluxoCaixaPage() {
  const [competencia, setCompetencia] = useState(new Date().toISOString().slice(0, 7));

  const { data: fluxo, isLoading } = useQuery({
    queryKey: ['fluxo-caixa', competencia],
    queryFn: () => api.get(`/financeiro/fluxo-caixa?competencia=${competencia}`).then((r) => r.data),
  });

  if (isLoading) return <Loading fullScreen />;

  const entradas = Number(fluxo?.entradas || 0);
  const saidas = Number(fluxo?.saidas || 0);
  const saldo = Number(fluxo?.saldo || 0);

  const chartData = {
    labels: ['Entradas', 'Saidas', 'Saldo'],
    datasets: [{
      data: [entradas, saidas, saldo],
      backgroundColor: ['#22c55e', '#ef4444', saldo >= 0 ? '#3b82f6' : '#ef4444'],
      borderRadius: 8,
    }],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Fluxo de Caixa</h1>

      <div className="card-premium p-4 flex items-center gap-4">
        <label className="text-sm dark:text-dark-text text-gray-700">Competencia:</label>
        <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className="input-premium w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium p-6">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Entradas</p>
          <p className="text-3xl font-bold text-green-500">{formatCurrencyFromNumber(entradas)}</p>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Saidas</p>
          <p className="text-3xl font-bold text-red-500">{formatCurrencyFromNumber(saidas)}</p>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Saldo</p>
          <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrencyFromNumber(saldo)}
          </p>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800 mb-4">Grafico</h3>
        <div className="h-80">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
