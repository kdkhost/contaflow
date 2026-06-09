import { useQuery } from '@tanstack/react-query';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { SwalInfo } from '../../utils/swal';

const nodeTypes = {
  processo: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 rounded-lg shadow-lg bg-blue-500/10 border border-blue-500 text-blue-500">
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
  evento: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 rounded-lg shadow-lg bg-yellow-500/10 border border-yellow-500 text-yellow-500">
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
  sistema: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 rounded-lg shadow-lg bg-purple-500/10 border border-purple-500 text-purple-500">
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
  resposta: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 rounded-lg shadow-lg bg-green-500/10 border border-green-500 text-green-500">
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
};

export default function MapaTrabalhistaPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mapeamento-trabalhista'],
    queryFn: () => api.get('/graphify/mapeamento-trabalhista').then((r) => r.data),
  });

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    SwalInfo(`Evento: ${node.data?.label}`);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Mapa Trabalhista - Graphify</h1>
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
