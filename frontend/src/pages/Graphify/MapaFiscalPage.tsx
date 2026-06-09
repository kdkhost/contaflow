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
  obrigacao: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 rounded-lg shadow-lg bg-green-500/10 border border-green-500 text-green-500">
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
};

export default function MapaFiscalPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mapeamento-fiscal'],
    queryFn: () => api.get('/graphify/mapeamento-fiscal').then((r) => r.data),
  });

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    SwalInfo(`Processo: ${node.data?.label}`);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Mapa Fiscal - Graphify</h1>
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
