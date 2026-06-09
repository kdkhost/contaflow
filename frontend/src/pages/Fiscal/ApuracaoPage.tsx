import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { formatCurrencyFromNumber } from '../../utils/masks';

export default function ApuracaoPage() {
  const [competencia, setCompetencia] = useState(new Date().toISOString().slice(0, 7));
  const [aba, setAba] = useState<'icms' | 'pis' | 'cofins'>('icms');

  const { data: icms, isLoading: loadingIcms } = useQuery({
    queryKey: ['apuracao-icms', competencia],
    queryFn: () => api.get(`/fiscal/icms/apurar?competencia=${competencia}`).then((r) => r.data),
  });

  const { data: pisCofins, isLoading: loadingPisCofins } = useQuery({
    queryKey: ['apuracao-pis-cofins', competencia],
    queryFn: () => api.get(`/fiscal/pis-cofins/apurar?competencia=${competencia}`).then((r) => r.data),
  });

  const isLoading = loadingIcms || loadingPisCofins;
  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Apuracao de Impostos</h1>

      <div className="card-premium p-4 flex items-center gap-4">
        <label className="text-sm dark:text-dark-text text-gray-700">Competencia:</label>
        <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className="input-premium w-48" />
      </div>

      <div className="flex gap-2">
        {(['icms', 'pis', 'cofins'] as const).map((tab) => (
          <button key={tab} onClick={() => setAba(tab)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${aba === tab ? 'bg-primary-500 text-white' : 'dark:bg-dark-card bg-gray-100 dark:text-dark-text text-gray-700 hover:bg-gray-200 dark:hover:bg-dark-tertiary'}`}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="card-premium p-6">
        {aba === 'icms' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">ICMS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10">
                <p className="text-sm dark:text-dark-text-secondary text-gray-500">ICMS Proprio</p>
                <p className="text-2xl font-bold text-blue-500">{formatCurrencyFromNumber(icms?.totalICMS || 0)}</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10">
                <p className="text-sm dark:text-dark-text-secondary text-gray-500">ICMS ST</p>
                <p className="text-2xl font-bold text-orange-500">{formatCurrencyFromNumber(icms?.totalICMSST || 0)}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10">
                <p className="text-sm dark:text-dark-text-secondary text-gray-500">Saldo Apurado</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrencyFromNumber(icms?.saldoApurado || 0)}</p>
              </div>
            </div>
            <p className="text-sm dark:text-dark-text-secondary text-gray-500">Notas processadas: {icms?.notasProcessadas || 0}</p>
          </div>
        )}

        {aba === 'pis' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">PIS</h3>
            <div className="p-4 rounded-lg bg-purple-500/10">
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total PIS</p>
              <p className="text-2xl font-bold text-purple-500">{formatCurrencyFromNumber(pisCofins?.totalPIS || 0)}</p>
            </div>
            <p className="text-sm dark:text-dark-text-secondary text-gray-500">Notas processadas: {pisCofins?.notasProcessadas || 0}</p>
          </div>
        )}

        {aba === 'cofins' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">COFINS</h3>
            <div className="p-4 rounded-lg bg-indigo-500/10">
              <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total COFINS</p>
              <p className="text-2xl font-bold text-indigo-500">{formatCurrencyFromNumber(pisCofins?.totalCOFINS || 0)}</p>
            </div>
            <p className="text-sm dark:text-dark-text-secondary text-gray-500">Notas processadas: {pisCofins?.notasProcessadas || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
}
