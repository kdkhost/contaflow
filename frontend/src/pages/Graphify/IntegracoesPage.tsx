import { useQuery } from '@tanstack/react-query';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import { SwalInfo } from '../../utils/swal';

const nodeTypes = {
  sistema: ({ data }: { data: { label: string } }) => (
    <div className="px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
      <p className="text-sm">{data.label}</p>
    </div>
  ),
  portal: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 rounded-lg shadow-lg dark:bg-dark-card bg-white dark:border-dark-border border-gray-200 dark:text-dark-text text-gray-800">
      <p className="text-sm font-medium">{data.label}</p>
    </div>
  ),
};

export default function IntegracoesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['integracoes-graphify'],
    queryFn: () => api.get('/graphify/integracoes').then((r) => r.data),
  });

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    SwalInfo(`Integracao: ${node.data?.label}`);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Integracoes com Portais - Graphify</h1>
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
