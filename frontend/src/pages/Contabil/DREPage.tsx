import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { formatCurrencyFromNumber } from '../../utils/masks';

export default function DREPage() {
  const [competenciaInicio, setCompetenciaInicio] = useState(new Date().toISOString().slice(0, 7));
  const [competenciaFim, setCompetenciaFim] = useState(new Date().toISOString().slice(0, 7));

  const { data: dre, isLoading, refetch } = useQuery({
    queryKey: ['dre', competenciaInicio, competenciaFim],
    queryFn: () => api.get(`/contabil/dre?competenciaInicio=${competenciaInicio}&competenciaFim=${competenciaFim}`).then((r) => r.data),
  });

  if (isLoading) return <Loading fullScreen />;

  const receitas = Number(dre?.receitas || 0);
  const despesas = Number(dre?.despesas || 0);
  const lucroLiquido = Number(dre?.lucroLiquido || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">DRE - Demonstracao do Resultado</h1>
        <button onClick={() => refetch()} className="btn-primary flex items-center gap-2">
          <ArrowPathIcon className="w-5 h-5" /> Atualizar
        </button>
      </div>

      <div className="card-premium p-4 flex items-center gap-4 flex-wrap">
        <label className="text-sm dark:text-dark-text text-gray-700">Periodo:</label>
        <input type="month" value={competenciaInicio} onChange={(e) => setCompetenciaInicio(e.target.value)} className="input-premium w-48" />
        <span className="dark:text-dark-text text-gray-700">ate</span>
        <input type="month" value={competenciaFim} onChange={(e) => setCompetenciaFim(e.target.value)} className="input-premium w-48" />
      </div>

      <div className="card-premium p-6">
        <h2 className="text-xl font-bold dark:text-dark-text text-gray-800 mb-6">Demonstracao do Resultado do Exercicio</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200">
            <span className="dark:text-dark-text text-gray-700">Receita Operacional Bruta</span>
            <span className="font-bold text-green-500">{formatCurrencyFromNumber(receitas)}</span>
          </div>
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200">
            <span className="dark:text-dark-text text-gray-700">(-) Deducoes da Receita</span>
            <span className="font-bold text-red-500">{formatCurrencyFromNumber(0)}</span>
          </div>
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200">
            <span className="dark:text-dark-text text-gray-700 font-medium">= Receita Operacional Liquida</span>
            <span className="font-bold dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(receitas)}</span>
          </div>
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200">
            <span className="dark:text-dark-text text-gray-700">(-) Despesas Operacionais</span>
            <span className="font-bold text-red-500">{formatCurrencyFromNumber(despesas)}</span>
          </div>
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200 bg-primary-500/5 px-4 rounded-lg">
            <span className="dark:text-dark-text text-gray-700 font-bold">= Lucro (Prejuizo) Operacional</span>
            <span className={`font-bold ${lucroLiquido >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrencyFromNumber(lucroLiquido)}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200">
            <span className="dark:text-dark-text text-gray-700">(-) Receitas/Despesas Nao Operacionais</span>
            <span className="font-bold dark:text-dark-text text-gray-800">{formatCurrencyFromNumber(0)}</span>
          </div>
          <div className="flex justify-between py-3 border-b dark:border-dark-border border-gray-200">
            <span className="dark:text-dark-text text-gray-700">(-) IRPJ e CSLL</span>
            <span className="font-bold text-red-500">{formatCurrencyFromNumber(0)}</span>
          </div>
          <div className="flex justify-between py-4 bg-primary-500/10 px-4 rounded-lg">
            <span className="text-lg font-bold dark:text-dark-text text-gray-800">= Lucro Liquido do Exercicio</span>
            <span className={`text-lg font-bold ${lucroLiquido >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrencyFromNumber(lucroLiquido)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
