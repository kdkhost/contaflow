import { useQuery } from '@tanstack/react-query';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { SwalInfo } from '../../utils/swal';

const nodeTypes = {
  contaContabil: ({ data }: { data: { label: string; tipo: string } }) => (
    <div className={`px-4 py-2 rounded-lg shadow-lg border ${
      data.tipo === 'ATIVO' ? 'bg-blue-500/10 border-blue-500 text-blue-500' :
      data.tipo === 'PASSIVO' ? 'bg-red-500/10 border-red-500 text-red-500' :
      data.tipo === 'RECEITA' ? 'bg-green-500/10 border-green-500 text-green-500' :
      data.tipo === 'DESPESA' ? 'bg-orange-500/10 border-orange-500 text-orange-500' :
      'bg-purple-500/10 border-purple-500 text-purple-500'
    }`}>
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
};

export default function MapaContabilPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mapeamento-contabil'],
    queryFn: () => api.get('/graphify/mapeamento-contabil').then((r) => r.data),
  });

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    SwalInfo(`Conta: ${node.data?.label}\nTipo: ${node.data?.tipo}`);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Mapa Contabil - Graphify</h1>
      <div className="card-premium overflow-hidden" style={{ height: '600px' }}>
        <ReactFlow
          nodes={data?.nodes || []}
          edges={data?.edges || []}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}
