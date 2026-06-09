import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import Modal, { ModalFooter } from '../../components/common/Modal';
import MaskedInput from '../../components/common/MaskedInput';
import AddressInput from '../../components/common/AddressInput';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { notifySuccess, notifyError } from '../../utils/notify';
import { SwalDeleteConfirm } from '../../utils/swal';
import { parseCurrencyToNumber, formatCurrencyFromNumber } from '../../utils/masks';

interface Funcionario {
  id: string;
  matricula: string;
  nome: string;
  cpf: string;
  cargo: string;
  funcao: string;
  dataAdmissao: string;
  salario: number;
  situacao: string;
  telefone: string;
  email: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

const initialForm = {
  matricula: '', nome: '', cpf: '', cargo: '', funcao: '',
  dataAdmissao: '', salario: '0,00', situacao: 'ATIVO',
  telefone: '', email: '',
  endereco: { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' },
};

export default function FuncionariosPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [form, setForm] = useState(initialForm);
  const [busca, setBusca] = useState('');

  const { data: funcionarios, isLoading } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => api.get('/pessoal/funcionarios').then((r) => r.data),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => api.post('/pessoal/funcionarios', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      notifySuccess('Funcionario cadastrado com sucesso!');
      setShowModal(false);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao cadastrar funcionario'),
  });

  const atualizarMutation = useMutation({
    mutationFn: (data: any) => api.put(`/pessoal/funcionarios/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      notifySuccess('Funcionario atualizado com sucesso!');
      setShowModal(false);
      setEditando(null);
      setForm(initialForm);
    },
    onError: () => notifyError('Erro ao atualizar funcionario'),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await SwalDeleteConfirm();
      if (result.isConfirmed) return api.delete(`/pessoal/funcionarios/${id}`);
      throw new Error('Cancelado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      notifySuccess('Funcionario excluido com sucesso!');
    },
    onError: () => {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { endereco, ...restForm } = form;
    const data = {
      ...restForm,
      cep: endereco?.cep || '',
      logradouro: endereco?.logradouro || '',
      numero: endereco?.numero || '',
      complemento: endereco?.complemento || '',
      bairro: endereco?.bairro || '',
      cidade: endereco?.cidade || '',
      uf: endereco?.uf || '',
      salario: parseCurrencyToNumber(form.salario),
    };
    if (editando) {
      atualizarMutation.mutate({ id: editando.id, ...data });
    } else {
      criarMutation.mutate(data);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await SwalDeleteConfirm();
    if (result.isConfirmed) {
      excluirMutation.mutate(id);
    }
  };

  const openEdit = (func: Funcionario) => {
    setEditando(func);
    setForm({
      matricula: func.matricula, nome: func.nome, cpf: func.cpf,
      cargo: func.cargo, funcao: func.funcao || '',
      dataAdmissao: func.dataAdmissao?.split('T')[0] || '',
      salario: func.salario ? formatCurrencyFromNumber(func.salario) : '0,00',
      situacao: func.situacao, telefone: func.telefone || '', email: func.email || '',
      endereco: func.endereco || { cep: (func as any).cep || '', logradouro: (func as any).logradouro || '', numero: (func as any).numero || '', complemento: (func as any).complemento || '', bairro: (func as any).bairro || '', cidade: (func as any).cidade || '', uf: (func as any).uf || '' },
    });
    setShowModal(true);
  };

  const funcionariosFiltrados = funcionarios?.filter((f: Funcionario) =>
    f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.cpf?.includes(busca)
  ) || [];

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-dark-text text-gray-800">Funcionarios</h1>
        <button onClick={() => { setEditando(null); setForm(initialForm); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Novo Funcionario
        </button>
      </div>

      <div className="card-premium p-4">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-premium w-full"
        />
      </div>

      <div className="card-premium overflow-hidden">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Matricula</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Cargo</th>
              <th>Telefone</th>
              <th>Salario</th>
              <th>Situacao</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.length === 0 ? (
              <tr><td colSpan={8}><EmptyState icon={UsersIcon} title="Nenhum funcionario encontrado" description="Cadastre o primeiro funcionario" /></td></tr>
            ) : (
              funcionariosFiltrados.map((func: Funcionario) => (
                <tr key={func.id}>
                  <td className="font-mono">{func.matricula}</td>
                  <td className="font-medium">{func.nome}</td>
                  <td className="font-mono">{func.cpf}</td>
                  <td>{func.cargo}</td>
                  <td>{func.telefone}</td>
                  <td className="font-medium">{formatCurrencyFromNumber(func.salario)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${func.situacao === 'ATIVO' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {func.situacao}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(func)} className="p-1.5 rounded-lg hover:bg-primary-500/10 text-primary-500 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(func.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditando(null); }} title={editando ? 'Editar Funcionario' : 'Novo Funcionario'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <MaskedInput mask="card" label="Matricula" value={form.matricula} onChange={(v) => setForm({ ...form, matricula: v })} required />
            <MaskedInput mask="cpf" label="CPF" value={form.cpf} onChange={(v) => setForm({ ...form, cpf: v })} placeholder="000.000.000-00" required />
            <MaskedInput mask="phone" label="Telefone" value={form.telefone} onChange={(v) => setForm({ ...form, telefone: v })} placeholder="(00) 00000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Nome Completo <span className="text-red-500">*</span></label>
            <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="input-premium" required />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-premium" placeholder="email@exemplo.com" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Cargo</label>
              <input type="text" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} className="input-premium" />
            </div>
            <MaskedInput mask="currency" label="Salario" value={form.salario} onChange={(v) => setForm({ ...form, salario: v })} placeholder="0,00" required />
            <div>
              <label className="block text-sm font-medium dark:text-dark-text-secondary text-gray-500 mb-1">Situacao</label>
              <select value={form.situacao} onChange={(e) => setForm({ ...form, situacao: e.target.value })} className="input-premium">
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="FERIAS">Ferias</option>
                <option value="AFASTADO">Afastado</option>
              </select>
            </div>
          </div>
          <MaskedInput mask="date" label="Data Admissao" value={form.dataAdmissao} onChange={(v) => setForm({ ...form, dataAdmissao: v })} placeholder="DD/MM/AAAA" required />
          <AddressInput value={form.endereco} onChange={(endereco) => setForm({ ...form, endereco })} />
          <ModalFooter onCancel={() => { setShowModal(false); setEditando(null); }} onConfirm={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} confirmLabel={editando ? 'Salvar' : 'Cadastrar'} isLoading={criarMutation.isPending || atualizarMutation.isPending} />
        </form>
      </Modal>
    </div>
  );
}
