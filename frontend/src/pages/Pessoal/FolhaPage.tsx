import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { UsersIcon } from '@heroicons/react/24/outline';
import { formatCurrencyFromNumber } from '../../utils/masks';

export default function FolhaPage() {
  const [competencia, setCompetencia] = useState(new Date().toISOString().slice(0, 7));

  const { data: folha, isLoading } = useQuery({
    queryKey: ['folha', competencia],
    queryFn: () => api.get(`/pessoal/folha/calcular?competencia=${competencia}`).then((r) => r.data),
  });

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Folha de Pagamento</h1>

      <div className="card-premium p-4 flex items-center gap-4">
        <label className="text-sm dark:text-dark-text text-gray-700">Competencia:</label>
        <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className="input-premium w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total Funcionarios</p>
          <p className="text-2xl font-bold dark:text-dark-text text-gray-800">{folha?.totalFuncionarios || 0}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total Bruto</p>
          <p className="text-2xl font-bold text-blue-500">{formatCurrencyFromNumber(folha?.totalBruto || 0)}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total Descontos</p>
          <p className="text-2xl font-bold text-red-500">{formatCurrencyFromNumber(folha?.totalDescontos || 0)}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm dark:text-dark-text-secondary text-gray-500">Total Liquido</p>
          <p className="text-2xl font-bold text-green-500">{formatCurrencyFromNumber(folha?.totalLiquido || 0)}</p>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr><th>Funcionario</th><th>Salario Base</th><th>INSS</th><th>FGTS</th><th>Liquido</th></tr>
          </thead>
          <tbody>
            {folha?.funcionarios?.length === 0 ? (
              <tr><td colSpan={5}><EmptyState icon={UsersIcon} title="Nenhum funcionario na folha" /></td></tr>
            ) : (
              folha?.funcionarios?.map((f: { funcionarioId: string; nome: string; salarioBase: number; inss: number; fgts: number; valorLiquido: number }) => (
                <tr key={f.funcionarioId}>
                  <td className="font-medium">{f.nome}</td>
                  <td>{formatCurrencyFromNumber(f.salarioBase)}</td>
                  <td className="text-red-500">{formatCurrencyFromNumber(f.inss)}</td>
                  <td className="text-orange-500">{formatCurrencyFromNumber(f.fgts)}</td>
                  <td className="font-bold text-green-500">{formatCurrencyFromNumber(f.valorLiquido)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
