import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { formatCurrencyFromNumber } from '../../utils/masks';

export default function BalancoPage() {
  const [competencia, setCompetencia] = useState(new Date().toISOString().slice(0, 7));

  const { data: balanco, isLoading } = useQuery({
    queryKey: ['balanco', competencia],
    queryFn: () => api.get(`/contabil/balanco?competencia=${competencia}`).then((r) => r.data),
  });

  if (isLoading) return <Loading fullScreen />;

  const ativoTotal = Number(balanco?.ativoTotal || 0);
  const passivoTotal = Number(balanco?.passivoTotal || 0);
  const pl = Number(balanco?.patrimonioLiquido || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Balanco Patrimonial</h1>

      <div className="card-premium p-4 flex items-center gap-4">
        <label className="text-sm dark:text-dark-text text-gray-700">Competencia:</label>
        <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className="input-premium w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h2 className="text-xl font-bold dark:text-dark-text text-gray-800 mb-4">ATIVO</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b dark:border-dark-border border-gray-200">
              <span className="dark:text-dark-text text-gray-700">Ativo Circulante</span>
              <span className="font-medium dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(ativoTotal * 0.6)}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-dark-border border-gray-200">
              <span className="dark:text-dark-text text-gray-700">Ativo Nao Circulante</span>
              <span className="font-medium dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(ativoTotal * 0.4)}</span>
            </div>
            <div className="flex justify-between py-3 bg-blue-500/10 px-3 rounded-lg">
              <span className="font-bold dark:text-dark-text text-gray-800">Total Ativo</span>
              <span className="font-bold text-blue-500">{formatCurrencyFromNumber(ativoTotal)}</span>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-xl font-bold dark:text-dark-text text-gray-800 mb-4">PASSIVO + PL</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b dark:border-dark-border border-gray-200">
              <span className="dark:text-dark-text text-gray-700">Passivo Circulante</span>
              <span className="font-medium dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(passivoTotal * 0.7)}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-dark-border border-gray-200">
              <span className="dark:text-dark-text text-gray-700">Passivo Nao Circulante</span>
              <span className="font-medium dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(passivoTotal * 0.3)}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-dark-border border-gray-200">
              <span className="dark:text-dark-text text-gray-700">Patrimonio Liquido</span>
              <span className="font-medium dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(pl)}</span>
            </div>
            <div className="flex justify-between py-3 bg-red-500/10 px-3 rounded-lg">
              <span className="font-bold dark:text-dark-text text-gray-800">Total Passivo + PL</span>
              <span className="font-bold text-red-500">{formatCurrencyFromNumber(passivoTotal + pl)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
