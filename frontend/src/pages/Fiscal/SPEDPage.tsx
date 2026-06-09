import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { notifySuccess, notifyError, notifyLoading, notifyDismiss } from '../../utils/notify';
import { SwalConfirm } from '../../utils/swal';

export default function SPEDPage() {
  const [competencia, setCompetencia] = useState(new Date().toISOString().slice(0, 7));

  const gerarMutation = useMutation({
    mutationFn: async (tipo: string) => {
      const result = await SwalConfirm('Gerar SPED', `Deseja gerar o ${tipo} referente a ${competencia}?`);
      if (!result.isConfirmed) throw new Error('Cancelado');
      const toastId = notifyLoading(`Gerando ${tipo}...`);
      try {
        const data = await api.get(`/fiscal/sped/gerar?tipo=${tipo}&competencia=${competencia}`).then((r) => r.data);
        notifyDismiss(toastId);
        return data;
      } catch (e) {
        notifyDismiss(toastId);
        throw e;
      }
    },
    onSuccess: (data) => {
      notifySuccess(`SPED ${data.tipo} gerado: ${data.arquivo}`);
    },
    onError: (e: any) => {
      if (e?.message !== 'Cancelado') notifyError('Erro ao gerar SPED');
    },
  });

  const gerarEfdMutation = useMutation({
    mutationFn: async () => {
      const result = await SwalConfirm('Gerar EFD', `Deseja gerar o EFD referente a ${competencia}?`);
      if (!result.isConfirmed) throw new Error('Cancelado');
      const toastId = notifyLoading('Gerando EFD...');
      try {
        const data = await api.get(`/fiscal/efd/gerar?competencia=${competencia}`).then((r) => r.data);
        notifyDismiss(toastId);
        return data;
      } catch (e) {
        notifyDismiss(toastId);
        throw e;
      }
    },
    onSuccess: (data) => {
      notifySuccess(`EFD gerado: ${data.arquivo}`);
    },
    onError: (e: any) => {
      if (e?.message !== 'Cancelado') notifyError('Erro ao gerar EFD');
    },
  });

  const obrigatorios = [
    { tipo: 'ECD', titulo: 'SPED ECD', descricao: 'Escrituracao Contabil Digital', prazo: 'Dia 15 do mes subsequente' },
    { tipo: 'ECF', titulo: 'SPED ECF', descricao: 'Escrituracao Contabil Fiscal', prazo: 'Ultimo dia util do mes subsequente' },
    { tipo: 'EFD_ICMS', titulo: 'EFD ICMS/IPI', descricao: 'Escrituracao Fiscal de Documentos', prazo: 'Dia 15 do mes subsequente' },
    { tipo: 'EFD_PIS', titulo: 'EFD PIS/COFINS', descricao: 'Escrituracao de PIS e COFINS', prazo: 'Dia 15 do mes subsequente' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">SPED e Obrigacoes</h1>

      <div className="card-premium p-4 flex items-center gap-4">
        <label className="text-sm dark:text-dark-text text-gray-700">Competencia:</label>
        <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className="input-premium w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {obrigatorios.map((obrig) => (
          <div key={obrig.tipo} className="card-premium p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">{obrig.titulo}</h3>
                <p className="text-sm dark:text-dark-text-secondary text-gray-500 mt-1">{obrig.descricao}</p>
                <p className="text-xs text-yellow-500 mt-2">Prazo: {obrig.prazo}</p>
              </div>
              <button onClick={() => gerarMutation.mutate(obrig.tipo)} disabled={gerarMutation.isPending} className="btn-primary flex items-center gap-2">
                <DocumentArrowDownIcon className="w-5 h-5" />
                Gerar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold dark:text-dark-text text-gray-800">EFD Reinf</h3>
            <p className="text-sm dark:text-dark-text-secondary text-gray-500">Escrituracao Fiscal de Retencoes</p>
          </div>
          <button onClick={() => gerarEfdMutation.mutate()} disabled={gerarEfdMutation.isPending} className="btn-primary flex items-center gap-2">
            <DocumentArrowDownIcon className="w-5 h-5" />
            Gerar
          </button>
        </div>
      </div>
    </div>
  );
}
