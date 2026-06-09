import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar empresa padrao
  const empresa = await prisma.empresas.create({
    data: {
      tenantId: 'contaflow-default',
      razaoSocial: 'ContaFlow Demonstracao Ltda',
      nomeFantasia: 'ContaFlow Demo',
      cnpj: '12.345.678/0001-90',
      inscricaoEstadual: '123456789',
      cnae: '6920601',
      naturezaJuridica: '2062',
      endereco: 'Rua Principal, 100',
      cidade: 'Sao Paulo',
      uf: 'SP',
      cep: '01234-567',
      telefone: '(11) 1234-5678',
      email: 'contato@contaflowdemo.com.br',
      modalidade: 'LUCRO_PRESUMIDO',
      status: 'ATIVO',
    },
  });

  console.log('Empresa criada:', empresa.razaoSocial);

  // Criar usuario admin
  const senhaHash = await hash('admin123', 12);
  const usuario = await prisma.usuarios.create({
    data: {
      empresaId: empresa.id,
      tenantId: empresa.tenantId,
      nome: 'Administrador',
      email: 'admin@contaflow.com.br',
      senha: senhaHash,
      cpf: '123.456.789-00',
      role: 'ADMIN',
      status: 'ATIVO',
    },
  });

  console.log('Usuario admin criado:', usuario.email);

  // Criar plano de contas
  const contas = [
    { codigo: '1', descricao: 'ATIVO', tipo: 'ATIVO', natureza: 'DEBITO', nivel: 1, aceitaLancamento: false },
    { codigo: '1.1', descricao: 'ATIVO CIRCULANTE', tipo: 'ATIVO', natureza: 'DEBITO', nivel: 2, aceitaLancamento: false },
    { codigo: '1.1.01', descricao: 'Caixa e Equivalentes', tipo: 'ATIVO', natureza: 'DEBITO', nivel: 3, aceitaLancamento: true },
    { codigo: '1.1.02', descricao: 'Bancos Conta Movimento', tipo: 'ATIVO', natureza: 'DEBITO', nivel: 3, aceitaLancamento: true },
    { codigo: '1.1.03', descricao: 'Contas a Receber', tipo: 'ATIVO', natureza: 'DEBITO', nivel: 3, aceitaLancamento: true },
    { codigo: '1.2', descricao: 'ATIVO NAO CIRCULANTE', tipo: 'ATIVO', natureza: 'DEBITO', nivel: 2, aceitaLancamento: false },
    { codigo: '2', descricao: 'PASSIVO', tipo: 'PASSIVO', natureza: 'CREDITO', nivel: 1, aceitaLancamento: false },
    { codigo: '2.1', descricao: 'PASSIVO CIRCULANTE', tipo: 'PASSIVO', natureza: 'CREDITO', nivel: 2, aceitaLancamento: false },
    { codigo: '2.1.01', descricao: 'Fornecedores', tipo: 'PASSIVO', natureza: 'CREDITO', nivel: 3, aceitaLancamento: true },
    { codigo: '2.1.02', descricao: 'Impostos a Recolher', tipo: 'PASSIVO', natureza: 'CREDITO', nivel: 3, aceitaLancamento: true },
    { codigo: '2.2', descricao: 'PASSIVO NAO CIRCULANTE', tipo: 'PASSIVO', natureza: 'CREDITO', nivel: 2, aceitaLancamento: false },
    { codigo: '3', descricao: 'PATRIMONIO LIQUIDO', tipo: 'PATRIMONIO_LIQUIDO', natureza: 'CREDITO', nivel: 1, aceitaLancamento: false },
    { codigo: '3.1', descricao: 'Capital Social', tipo: 'PATRIMONIO_LIQUIDO', natureza: 'CREDITO', nivel: 2, aceitaLancamento: true },
    { codigo: '3.2', descricao: 'Reservas', tipo: 'PATRIMONIO_LIQUIDO', natureza: 'CREDITO', nivel: 2, aceitaLancamento: true },
    { codigo: '4', descricao: 'RECEITAS', tipo: 'RECEITA', natureza: 'CREDITO', nivel: 1, aceitaLancamento: true },
    { codigo: '4.1', descricao: 'Receita Operacional', tipo: 'RECEITA', natureza: 'CREDITO', nivel: 2, aceitaLancamento: true },
    { codigo: '5', descricao: 'DESPESAS', tipo: 'DESPESA', natureza: 'DEBITO', nivel: 1, aceitaLancamento: true },
    { codigo: '5.1', descricao: 'Despesas Administrativas', tipo: 'DESPESA', natureza: 'DEBITO', nivel: 2, aceitaLancamento: true },
    { codigo: '5.2', descricao: 'Despesas Comerciais', tipo: 'DESPESA', natureza: 'DEBITO', nivel: 2, aceitaLancamento: true },
    { codigo: '5.3', descricao: 'Despesas Financeiras', tipo: 'DESPESA', natureza: 'DEBITO', nivel: 2, aceitaLancamento: true },
  ];

  for (const conta of contas) {
    await prisma.contasContabeis.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...conta,
      },
    });
  }

  console.log('Plano de contas criado:', contas.length, 'contas');

  // Criar 15 funcionarios
  const funcionarios = [
    { matricula: '001', nome: 'Joao Silva', cpf: '987.654.321-00', cargo: 'Gerente Financeiro', funcao: 'Gerente', salario: 12000, dataAdmissao: new Date('2022-03-15'), sexo: 'M', estadoCivil: 'CASADO', telefone: '(11) 99876-5432', email: 'joao.silva@email.com' },
    { matricula: '002', nome: 'Maria Santos', cpf: '111.222.333-44', cargo: 'Analista Contabil', funcao: 'Analista', salario: 6500, dataAdmissao: new Date('2023-01-10'), sexo: 'F', estadoCivil: 'SOLTEIRA', telefone: '(11) 98765-4321', email: 'maria.santos@email.com' },
    { matricula: '003', nome: 'Pedro Oliveira', cpf: '222.333.444-55', cargo: 'Assistente Administrativo', funcao: 'Assistente', salario: 3200, dataAdmissao: new Date('2023-06-20'), sexo: 'M', estadoCivil: 'SOLTEIRO', telefone: '(11) 97654-3210', email: 'pedro.oliveira@email.com' },
    { matricula: '004', nome: 'Ana Costa', cpf: '333.444.555-66', cargo: 'Contadora', funcao: 'Contador', salario: 9500, dataAdmissao: new Date('2022-08-05'), sexo: 'F', estadoCivil: 'CASADA', telefone: '(11) 96543-2109', email: 'ana.costa@email.com' },
    { matricula: '005', nome: 'Carlos Ferreira', cpf: '444.555.666-77', cargo: 'Analista de Sistemas', funcao: 'Analista', salario: 8000, dataAdmissao: new Date('2023-03-01'), sexo: 'M', estadoCivil: 'SOLTEIRO', telefone: '(11) 95432-1098', email: 'carlos.ferreira@email.com' },
    { matricula: '006', nome: 'Lucia Mendes', cpf: '555.666.777-88', cargo: 'Secretaria', funcao: 'Secretaria', salario: 2800, dataAdmissao: new Date('2024-02-15'), sexo: 'F', estadoCivil: 'SOLTEIRA', telefone: '(11) 94321-0987', email: 'lucia.mendes@email.com' },
    { matricula: '007', nome: 'Roberto Almeida', cpf: '666.777.888-99', cargo: 'Gerente Comercial', funcao: 'Gerente', salario: 11000, dataAdmissao: new Date('2022-05-10'), sexo: 'M', estadoCivil: 'CASADO', telefone: '(11) 93210-9876', email: 'roberto.almeida@email.com' },
    { matricula: '008', nome: 'Fernanda Lima', cpf: '777.888.999-00', cargo: 'Analista Fiscal', funcao: 'Analista', salario: 7000, dataAdmissao: new Date('2023-09-01'), sexo: 'F', estadoCivil: 'SOLTEIRA', telefone: '(11) 92109-8765', email: 'fernanda.lima@email.com' },
    { matricula: '009', nome: 'Marcos Souza', cpf: '888.999.000-11', cargo: 'Motorista', funcao: 'Motorista', salario: 2500, dataAdmissao: new Date('2024-01-20'), sexo: 'M', estadoCivil: 'CASADO', telefone: '(11) 91098-7654', email: 'marcos.souza@email.com' },
    { matricula: '010', nome: 'Patricia Ribeiro', cpf: '999.000.111-22', cargo: 'Assistente Fiscal', funcao: 'Assistente', salario: 3500, dataAdmissao: new Date('2023-11-15'), sexo: 'F', estadoCivil: 'SOLTEIRA', telefone: '(11) 90987-6543', email: 'patricia.ribeiro@email.com' },
    { matricula: '011', nome: 'Ricardo Barbosa', cpf: '000.111.222-33', cargo: 'Analista de RH', funcao: 'Analista', salario: 6000, dataAdmissao: new Date('2023-04-10'), sexo: 'M', estadoCivil: 'SOLTEIRO', telefone: '(11) 99876-5433', email: 'ricardo.barbosa@email.com' },
    { matricula: '012', nome: 'Camila Araujo', cpf: '111.222.333-55', cargo: 'Estagiaria', funcao: 'Estagiaria', salario: 1500, dataAdmissao: new Date('2024-03-01'), sexo: 'F', estadoCivil: 'SOLTEIRA', telefone: '(11) 98765-4322', email: 'camila.araujo@email.com' },
    { matricula: '013', nome: 'Eduardo Gomes', cpf: '222.333.444-66', cargo: 'Gerente de TI', funcao: 'Gerente', salario: 13000, dataAdmissao: new Date('2022-01-05'), sexo: 'M', estadoCivil: 'CASADO', telefone: '(11) 97654-3211', email: 'eduardo.gomes@email.com' },
    { matricula: '014', nome: 'Tatiane Martins', cpf: '333.444.555-77', cargo: 'Assistente Comercial', funcao: 'Assistente', salario: 3000, dataAdmissao: new Date('2024-01-10'), sexo: 'F', estadoCivil: 'SOLTEIRA', telefone: '(11) 96543-2108', email: 'tatiane.martins@email.com' },
    { matricula: '015', nome: 'Gustavo Pereira', cpf: '444.555.666-88', cargo: 'Analista de Marketing', funcao: 'Analista', salario: 5500, dataAdmissao: new Date('2023-07-20'), sexo: 'M', estadoCivil: 'SOLTEIRO', telefone: '(11) 95432-1099', email: 'gustavo.pereira@email.com' },
  ];

  for (const func of funcionarios) {
    await prisma.funcionarios.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...func,
        situacao: 'ATIVO',
        tipoContrato: 'CLT',
      },
    });
  }

  console.log('Funcionarios criados:', funcionarios.length);

  // Criar contas bancarias
  const contasBancarias = [
    { descricao: 'Banco do Brasil - CC', banco: '001', agencia: '1234-5', conta: '67890-1', tipoConta: 'CORRENTE', saldoInicial: 50000, saldoAtual: 75000 },
    { descricao: 'Itau - CC', banco: '341', agencia: '5678-9', conta: '12345-6', tipoConta: 'CORRENTE', saldoInicial: 30000, saldoAtual: 45000 },
    { descricao: 'Bradesco - Poupanca', banco: '237', agencia: '9012-3', conta: '98765-4', tipoConta: 'POUPANCA', saldoInicial: 10000, saldoAtual: 12000 },
    { descricao: 'Caixa Federal - CC', banco: '104', agencia: '4567-8', conta: '54321-0', tipoConta: 'CORRENTE', saldoInicial: 25000, saldoAtual: 38000 },
    { descricao: 'Nubank - PJ', banco: '260', agencia: '0001', conta: '99999-9', tipoConta: 'CORRENTE', saldoInicial: 15000, saldoAtual: 22000 },
  ];

  const contasBancariasCriadas = [];
  for (const conta of contasBancarias) {
    const criada = await prisma.contasBancarias.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...conta,
        moeda: 'BRL',
        ativa: true,
        contabilizar: true,
      },
    });
    contasBancariasCriadas.push(criada);
  }

  console.log('Contas bancarias criadas:', contasBancarias.length);

  // Criar 15 contas a pagar
  const contasPagar = [
    { descricao: 'Aluguel Escritorio', fornecedor: 'Imobiliária Central', cnpjFornecedor: '11.222.333/0001-44', valor: 8500, dataVencimento: new Date('2026-06-10'), status: 'PENDENTE', formaPagamento: 'BOLETO' },
    { descricao: 'Energia Eletrica', fornecedor: 'CPFL', cnpjFornecedor: '22.333.444/0001-55', valor: 2300, dataVencimento: new Date('2026-06-15'), status: 'PENDENTE', formaPagamento: 'DEBITO_AUTOMATICO' },
    { descricao: 'Internet e Telefone', fornecedor: 'Vivo Empresas', cnpjFornecedor: '33.444.555/0001-66', valor: 890, dataVencimento: new Date('2026-06-20'), status: 'PENDENTE', formaPagamento: 'PIX' },
    { descricao: 'Software Contabil', fornecedor: 'ContaFlow Tech', cnpjFornecedor: '44.555.666/0001-77', valor: 450, dataVencimento: new Date('2026-06-05'), status: 'PAGO', dataPagamento: new Date('2026-06-03'), formaPagamento: 'PIX' },
    { descricao: 'Material de Escritorio', fornecedor: 'Papelaria Central', cnpjFornecedor: '55.666.777/0001-88', valor: 1200, dataVencimento: new Date('2026-06-10'), status: 'PAGO', dataPagamento: new Date('2026-06-08'), formaPagamento: 'CARTAO_CREDITO' },
    { descricao: 'Limpeza Semanal', fornecedor: 'Clean Service', cnpjFornecedor: '66.777.888/0001-99', valor: 1800, dataVencimento: new Date('2026-06-25'), status: 'PENDENTE', formaPagamento: 'PIX' },
    { descricao: 'Contabilidade External', fornecedor: 'Contabil Express', cnpjFornecedor: '77.888.999/0001-00', valor: 3500, dataVencimento: new Date('2026-06-30'), status: 'PENDENTE', formaPagamento: 'TRANSFERENCIA' },
    { descricao: 'Seguro Empresarial', fornecedor: 'Seguradora Total', cnpjFornecedor: '88.999.000/0001-11', valor: 2800, dataVencimento: new Date('2026-06-18'), status: 'PENDENTE', formaPagamento: 'BOLETO' },
    { descricao: 'Condominio', fornecedor: 'Admin Condominios', cnpjFornecedor: '99.000.111/0001-22', valor: 4200, dataVencimento: new Date('2026-06-10'), status: 'ATRASADO', formaPagamento: 'BOLETO' },
    { descricao: 'Telefone Celular Corporativo', fornecedor: 'TIM Empresas', cnpjFornecedor: '00.111.222/0001-33', valor: 1500, dataVencimento: new Date('2026-06-22'), status: 'PENDENTE', formaPagamento: 'DEBITO_AUTOMATICO' },
    { descricao: 'Manutencao Computadores', fornecedor: 'Tech Support LTDA', cnpjFornecedor: '11.222.333/0001-55', valor: 980, dataVencimento: new Date('2026-06-28'), status: 'PENDENTE', formaPagamento: 'PIX' },
    { descricao: 'Contabilidade External', fornecedor: 'Contabil Express', cnpjFornecedor: '77.888.999/0001-00', valor: 3500, dataVencimento: new Date('2026-05-30'), status: 'PAGO', dataPagamento: new Date('2026-05-28'), formaPagamento: 'TRANSFERENCIA' },
    { descricao: 'Energia Eletrica', fornecedor: 'CPFL', cnpjFornecedor: '22.333.444/0001-55', valor: 2100, dataVencimento: new Date('2026-05-15'), status: 'PAGO', dataPagamento: new Date('2026-05-14'), formaPagamento: 'DEBITO_AUTOMATICO' },
    { descricao: 'Aluguel Escritorio', fornecedor: 'Imobiliária Central', cnpjFornecedor: '11.222.333/0001-44', valor: 8500, dataVencimento: new Date('2026-05-10'), status: 'PAGO', dataPagamento: new Date('2026-05-09'), formaPagamento: 'BOLETO' },
    { descricao: 'Software Contabil', fornecedor: 'ContaFlow Tech', cnpjFornecedor: '44.555.666/0001-77', valor: 450, dataVencimento: new Date('2026-05-05'), status: 'PAGO', dataPagamento: new Date('2026-05-04'), formaPagamento: 'PIX' },
  ];

  for (const conta of contasPagar) {
    await prisma.contasPagar.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...conta,
      },
    });
  }

  console.log('Contas a pagar criadas:', contasPagar.length);

  // Criar 15 contas a receber
  const contasReceber = [
    { descricao: 'Servico Consultoria', cliente: 'Empresa Alpha LTDA', cpfCnpjCliente: '11.222.333/0001-01', valor: 15000, dataVencimento: new Date('2026-06-15'), status: 'PENDENTE', formaPagamento: 'BOLETO' },
    { descricao: 'Assessoria Mensal', cliente: 'Comercio Beta SA', cpfCnpjCliente: '22.333.444/0001-02', valor: 8500, dataVencimento: new Date('2026-06-20'), status: 'PENDENTE', formaPagamento: 'PIX' },
    { descricao: 'Projeto Sistema', cliente: 'Industria Gamma LTDA', cpfCnpjCliente: '33.444.555/0001-03', valor: 45000, dataVencimento: new Date('2026-06-30'), status: 'PENDENTE', formaPagamento: 'TRANSFERENCIA' },
    { descricao: 'Treinamento', cliente: 'Educacao Delta SA', cpfCnpjCliente: '44.555.666/0001-04', valor: 6000, dataVencimento: new Date('2026-06-10'), status: 'PAGO', dataRecebimento: new Date('2026-06-08'), formaPagamento: 'PIX' },
    { descricao: 'Auditoria Anual', cliente: 'Financeira Epsilon', cpfCnpjCliente: '55.666.777/0001-05', valor: 25000, dataVencimento: new Date('2026-06-25'), status: 'PENDENTE', formaPagamento: 'BOLETO' },
    { descricao: 'Consultoria Fiscal', cliente: 'Zeta Comercio', cpfCnpjCliente: '66.777.888/0001-06', valor: 12000, dataVencimento: new Date('2026-06-18'), status: 'PENDENTE', formaPagamento: 'PIX' },
    { descricao: 'Assessoria Juridica', cliente: 'Eta Servicos LTDA', cpfCnpjCliente: '77.888.999/0001-07', valor: 9500, dataVencimento: new Date('2026-06-22'), status: 'PENDENTE', formaPagamento: 'BOLETO' },
    { descricao: 'Projeto Web', cliente: 'Theta Tecnologia', cpfCnpjCliente: '88.999.000/0001-08', valor: 32000, dataVencimento: new Date('2026-06-05'), status: 'PAGO', dataRecebimento: new Date('2026-06-04'), formaPagamento: 'TRANSFERENCIA' },
    { descricao: 'Servico Contabil', cliente: 'Iota Industria', cpfCnpjCliente: '99.000.111/0001-09', valor: 7800, dataVencimento: new Date('2026-06-28'), status: 'PENDENTE', formaPagamento: 'PIX' },
    { descricao: 'Consultoria RH', cliente: 'Kappa Comercio', cpfCnpjCliente: '00.111.222/0001-10', valor: 5500, dataVencimento: new Date('2026-06-12'), status: 'ATRASADO', formaPagamento: 'BOLETO' },
    { descricao: 'Assessoria Mensal', cliente: 'Comercio Beta SA', cpfCnpjCliente: '22.333.444/0001-02', valor: 8500, dataVencimento: new Date('2026-05-20'), status: 'PAGO', dataRecebimento: new Date('2026-05-19'), formaPagamento: 'PIX' },
    { descricao: 'Servico Consultoria', cliente: 'Empresa Alpha LTDA', cpfCnpjCliente: '11.222.333/0001-01', valor: 15000, dataVencimento: new Date('2026-05-15'), status: 'PAGO', dataRecebimento: new Date('2026-05-14'), formaPagamento: 'BOLETO' },
    { descricao: 'Treinamento', cliente: 'Educacao Delta SA', cpfCnpjCliente: '44.555.666/0001-04', valor: 6000, dataVencimento: new Date('2026-05-10'), status: 'PAGO', dataRecebimento: new Date('2026-05-09'), formaPagamento: 'PIX' },
    { descricao: 'Projeto Sistema', cliente: 'Industria Gamma LTDA', cpfCnpjCliente: '33.444.555/0001-03', valor: 45000, dataVencimento: new Date('2026-05-30'), status: 'PAGO', dataRecebimento: new Date('2026-05-29'), formaPagamento: 'TRANSFERENCIA' },
    { descricao: 'Auditoria Anual', cliente: 'Financeira Epsilon', cpfCnpjCliente: '55.666.777/0001-05', valor: 25000, dataVencimento: new Date('2026-05-25'), status: 'PAGO', dataRecebimento: new Date('2026-05-24'), formaPagamento: 'BOLETO' },
  ];

  for (const conta of contasReceber) {
    await prisma.contasReceber.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...conta,
      },
    });
  }

  console.log('Contas a receber criadas:', contasReceber.length);

  // Criar 15 notas fiscais
  const notasFiscais = [
    { chaveAcesso: '35260612345678000190550010000001231234567890', numero: '123', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-01'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 15000, valorIcms: 2700, valorPis: 225, valorCofins: 1035, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001241234567891', numero: '124', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-03'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 8500, valorIcms: 1530, valorPis: 127.50, valorCofins: 586.50, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001251234567892', numero: '125', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-05'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 22000, valorIcms: 3960, valorPis: 330, valorCofins: 1518, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001261234567893', numero: '126', serie: '1', tipo: 'NFS_E', dataEmissao: new Date('2026-06-07'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 6000, status: 'AUTORIZADA', cfop: '5933', naturezaOperacao: 'Prestacao de Servico' },
    { chaveAcesso: '35260612345678000190550010000001271234567894', numero: '127', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-10'), cnpjEmitente: '98.765.432/0001-10', razaoSocialEmitente: 'Fornecedor ABC', valorTotal: 12000, valorIcms: 2160, valorPis: 180, valorCofins: 828, status: 'PENDENTE', cfop: '1102', naturezaOperacao: 'Compra de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001281234567895', numero: '128', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-12'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 35000, valorIcms: 6300, valorPis: 525, valorCofins: 2415, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001291234567896', numero: '129', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-14'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 4500, valorIcms: 810, valorPis: 67.50, valorCofins: 310.50, status: 'CANCELADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria', motivoStatus: 'Erro na digitacao' },
    { chaveAcesso: '35260612345678000190550010000001301234567897', numero: '130', serie: '1', tipo: 'NFS_E', dataEmissao: new Date('2026-06-16'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 9800, status: 'AUTORIZADA', cfop: '5933', naturezaOperacao: 'Prestacao de Servico' },
    { chaveAcesso: '35260612345678000190550010000001311234567898', numero: '131', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-18'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 18500, valorIcms: 3330, valorPis: 277.50, valorCofins: 1276.50, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001321234567899', numero: '132', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-06-20'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 7200, valorIcms: 1296, valorPis: 108, valorCofins: 496.80, status: 'PENDENTE', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001331234567800', numero: '133', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-05-05'), cnpjEmitente: '98.765.432/0001-10', razaoSocialEmitente: 'Fornecedor ABC', valorTotal: 9500, valorIcms: 1710, valorPis: 142.50, valorCofins: 655.50, status: 'AUTORIZADA', cfop: '1102', naturezaOperacao: 'Compra de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001341234567801', numero: '134', serie: '1', tipo: 'NFS_E', dataEmissao: new Date('2026-05-10'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 11000, status: 'AUTORIZADA', cfop: '5933', naturezaOperacao: 'Prestacao de Servico' },
    { chaveAcesso: '35260612345678000190550010000001351234567802', numero: '135', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-05-15'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 28000, valorIcms: 5040, valorPis: 420, valorCofins: 1932, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001361234567803', numero: '136', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-05-20'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 5500, valorIcms: 990, valorPis: 82.50, valorCofins: 379.50, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
    { chaveAcesso: '35260612345678000190550010000001371234567804', numero: '137', serie: '1', tipo: 'NF_E', dataEmissao: new Date('2026-05-25'), cnpjEmitente: '12.345.678/0001-90', razaoSocialEmitente: 'ContaFlow Demo', valorTotal: 16500, valorIcms: 2970, valorPis: 247.50, valorCofins: 1138.50, status: 'AUTORIZADA', cfop: '5102', naturezaOperacao: 'Venda de Mercadoria' },
  ];

  for (const nota of notasFiscais) {
    await prisma.notasFiscais.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...nota,
      },
    });
  }

  console.log('Notas fiscais criadas:', notasFiscais.length);

  // Criar 15 lancamentos contabeis
  const lancamentos = [
    { descricao: 'Receita Venda Produto A', valor: 15000, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-01'), dataContabil: new Date('2026-06-01') },
    { descricao: 'Despesa Aluguel', valor: 8500, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-01'), dataContabil: new Date('2026-06-01') },
    { descricao: 'Receita Servico Consultoria', valor: 8500, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-03'), dataContabil: new Date('2026-06-03') },
    { descricao: 'Despesa Energia', valor: 2300, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-05'), dataContabil: new Date('2026-06-05') },
    { descricao: 'Receita Venda Produto B', valor: 22000, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-07'), dataContabil: new Date('2026-06-07') },
    { descricao: 'Despesa Internet', valor: 890, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-10'), dataContabil: new Date('2026-06-10') },
    { descricao: 'Receita Projeto Sistema', valor: 45000, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-12'), dataContabil: new Date('2026-06-12') },
    { descricao: 'Despesa Material Escritorio', valor: 1200, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-14'), dataContabil: new Date('2026-06-14') },
    { descricao: 'Receita Treinamento', valor: 6000, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-16'), dataContabil: new Date('2026-06-16') },
    { descricao: 'Despesa Limpeza', valor: 1800, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-18'), dataContabil: new Date('2026-06-18') },
    { descricao: 'Receita Auditoria', valor: 25000, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-20'), dataContabil: new Date('2026-06-20') },
    { descricao: 'Despesa Contabilidade', valor: 3500, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-22'), dataContabil: new Date('2026-06-22') },
    { descricao: 'Receita Assessoria Mensal', valor: 8500, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-24'), dataContabil: new Date('2026-06-24') },
    { descricao: 'Despesa Seguro', valor: 2800, tipo: 'DEBITO', contaCodigo: '5.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-26'), dataContabil: new Date('2026-06-26') },
    { descricao: 'Receita Consultoria Fiscal', valor: 12000, tipo: 'CREDITO', contaCodigo: '4.1', competencia: '2026-06', status: 'CONFIRMADO', dataLancamento: new Date('2026-06-28'), dataContabil: new Date('2026-06-28') },
  ];

  for (const lanc of lancamentos) {
    const conta = await prisma.contasContabeis.findFirst({
      where: { empresaId: empresa.id, codigo: lanc.contaCodigo },
    });
    if (conta) {
      await prisma.lancamentos.create({
        data: {
          empresaId: empresa.id,
          tenantId: empresa.tenantId,
          usuarioId: usuario.id,
          contaContabilId: conta.id,
          descricao: lanc.descricao,
          valor: lanc.valor,
          tipo: lanc.tipo,
          competencia: lanc.competencia,
          status: lanc.status,
          dataLancamento: lanc.dataLancamento,
          dataContabil: lanc.dataContabil,
        },
      });
    }
  }

  console.log('Lancamentos contabeis criados:', lancamentos.length);

  // Criar 12 eventos eSocial
  const eventosEsocial = [
    { tipo: 'S_1200', codigo: 'S-1200', descricao: 'Remuneracao de Trabalhador Vinculado ao RGPS', competencia: '2026-06', status: 'ACEITO', funcionarioIndex: 0 },
    { tipo: 'S_1210', codigo: 'S-1210', descricao: 'Pagamentos de Rendimentos do Trabalho', competencia: '2026-06', status: 'ACEITO', funcionarioIndex: 0 },
    { tipo: 'S_1299', codigo: 'S-1299', descricao: 'Fechamento dos Eventos Periodicos', competencia: '2026-06', status: 'PENDENTE', funcionarioIndex: undefined },
    { tipo: 'S_2200', codigo: 'S-2200', descricao: 'Cadastramento Inicial / Admissao', competencia: '2026-06', status: 'ACEITO', funcionarioIndex: 11 },
    { tipo: 'S_2205', codigo: 'S-2205', descricao: 'Alteracao de Dados Cadastrais', competencia: '2026-06', status: 'ENVIADO', funcionarioIndex: 2 },
    { tipo: 'S_2230', codigo: 'S-2230', descricao: 'Afastamento Temporario', competencia: '2026-06', status: 'PENDENTE', funcionarioIndex: 8 },
    { tipo: 'S_1200', codigo: 'S-1200', descricao: 'Remuneracao de Trabalhador Vinculado ao RGPS', competencia: '2026-05', status: 'ACEITO', funcionarioIndex: 0 },
    { tipo: 'S_1210', codigo: 'S-1210', descricao: 'Pagamentos de Rendimentos do Trabalho', competencia: '2026-05', status: 'ACEITO', funcionarioIndex: 0 },
    { tipo: 'S_1299', codigo: 'S-1299', descricao: 'Fechamento dos Eventos Periodicos', competencia: '2026-05', status: 'ACEITO', funcionarioIndex: undefined },
    { tipo: 'S_2200', codigo: 'S-2200', descricao: 'Cadastramento Inicial / Admissao', competencia: '2026-05', status: 'ACEITO', funcionarioIndex: 13 },
    { tipo: 'S_2206', codigo: 'S-2206', descricao: 'Alteracao Contratual', competencia: '2026-06', status: 'REJEITADO', funcionarioIndex: 3 },
    { tipo: 'S_2299', codigo: 'S-2299', descricao: 'Desligamento', competencia: '2026-06', status: 'PENDENTE', funcionarioIndex: 11 },
  ];

  const funcionariosList = await prisma.funcionarios.findMany({
    where: { empresaId: empresa.id },
    orderBy: { matricula: 'asc' },
  });

  for (const evento of eventosEsocial) {
    await prisma.eventosEsocial.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        tipo: evento.tipo as 'S_1200',
        codigo: evento.codigo,
        descricao: evento.descricao,
        competencia: evento.competencia,
        dataEvento: new Date(),
        status: evento.status,
        funcionarioId: evento.funcionarioIndex !== undefined ? funcionariosList[evento.funcionarioIndex]?.id : undefined,
      },
    });
  }

  console.log('Eventos eSocial criados:', eventosEsocial.length);

  // Criar 12 calendario fiscal
  const calendarioFiscal = [
    { titulo: ' DARF IRPJ', descricao: 'Pagamento DARF IRPJ mensal', dataInicio: new Date('2026-06-15'), dataFim: new Date('2026-06-15'), tipo: 'FEDERAL', competencia: '2026-05', obrigacao: 'DARF IRPJ', status: 'PENDENTE' },
    { titulo: 'DARF CSLL', descricao: 'Pagamento DARF CSLL mensal', dataInicio: new Date('2026-06-15'), dataFim: new Date('2026-06-15'), tipo: 'FEDERAL', competencia: '2026-05', obrigacao: 'DARF CSLL', status: 'PENDENTE' },
    { titulo: 'DARF PIS', descricao: 'Pagamento DARF PIS mensal', dataInicio: new Date('2026-06-15'), dataFim: new Date('2026-06-15'), tipo: 'FEDERAL', competencia: '2026-05', obrigacao: 'DARF PIS', status: 'PENDENTE' },
    { titulo: 'DARF COFINS', descricao: 'Pagamento DARF COFINS mensal', dataInicio: new Date('2026-06-15'), dataFim: new Date('2026-06-15'), tipo: 'FEDERAL', competencia: '2026-05', obrigacao: 'DARF COFINS', status: 'PENDENTE' },
    { titulo: 'GPS INSS', descricao: 'Guia da Previdencia Social', dataInicio: new Date('2026-06-20'), dataFim: new Date('2026-06-20'), tipo: 'FEDERAL', competencia: '2026-06', obrigacao: 'GPS INSS', status: 'PENDENTE' },
    { titulo: 'FGTS', descricao: 'Guia FGTS mensal', dataInicio: new Date('2026-06-20'), dataFim: new Date('2026-06-20'), tipo: 'FEDERAL', competencia: '2026-06', obrigacao: 'FGTS', status: 'PENDENTE' },
    { titulo: 'ICMS Mensal', descricao: 'Declaracao ICMS mensal', dataInicio: new Date('2026-07-10'), dataFim: new Date('2026-07-10'), tipo: 'ESTADUAL', competencia: '2026-06', obrigacao: 'ICMS', status: 'PENDENTE' },
    { titulo: 'ISS Mensal', descricao: 'Declaracao ISS mensal', dataInicio: new Date('2026-07-10'), dataFim: new Date('2026-07-10'), tipo: 'MUNICIPAL', competencia: '2026-06', obrigacao: 'ISS', status: 'PENDENTE' },
    { titulo: 'SPED EFD', descricao: 'Escrituracao Fiscal Digital', dataInicio: new Date('2026-07-15'), dataFim: new Date('2026-07-15'), tipo: 'FEDERAL', competencia: '2026-06', obrigacao: 'SPED EFD', status: 'PENDENTE' },
    { titulo: 'SPED ECD', descricao: 'Escrituracao Contabil Digital', dataInicio: new Date('2026-07-31'), dataFim: new Date('2026-07-31'), tipo: 'FEDERAL', competencia: '2026-06', obrigacao: 'SPED ECD', status: 'PENDENTE' },
    { titulo: 'eSocial Fechamento', descricao: 'Fechamento eventos periodicos eSocial', dataInicio: new Date('2026-07-07'), dataFim: new Date('2026-07-07'), tipo: 'FEDERAL', competencia: '2026-06', obrigacao: 'eSocial', status: 'PENDENTE' },
    { titulo: 'DCTFWeb', descricao: 'Declaracao de Creditos e Tributos Federais', dataInicio: new Date('2026-07-15'), dataFim: new Date('2026-07-15'), tipo: 'FEDERAL', competencia: '2026-06', obrigacao: 'DCTFWeb', status: 'PENDENTE' },
  ];

  for (const evento of calendarioFiscal) {
    await prisma.calendarioFiscal.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...evento,
      },
    });
  }

  console.log('Calendario fiscal criado:', calendarioFiscal.length);

  // Criar 12 kanban tarefas
  const kanbanTarefas = [
    { titulo: 'Conciliacao Bancaria Junho', descricao: 'Realizar conciliacao de todas as contas bancarias do mes', status: 'PENDENTE', prioridade: 'high', dataVencimento: '2026-06-30', responsavel: 'Joao Silva' },
    { titulo: 'Envio eSocial Fechamento', descricao: 'Enviar fechamento dos eventos periodicos do eSocial', status: 'PENDENTE', prioridade: 'high', dataVencimento: '2026-07-07', responsavel: 'Ana Costa' },
    { titulo: 'Preparacao SPED EFD', descricao: 'Preparar dados para Escrituracao Fiscal Digital', status: 'EM_PROGRESSO', prioridade: 'medium', dataVencimento: '2026-07-15', responsavel: 'Fernanda Lima' },
    { titulo: 'Revisao Notas Fiscais', descricao: 'Revisar todas as notas fiscais do mes para conferencia', status: 'EM_PROGRESSO', prioridade: 'medium', dataVencimento: '2026-06-25', responsavel: 'Maria Santos' },
    { titulo: 'Pagamento Funcionarios', descricao: 'Processar folha de pagamento do mes', status: 'CONCLUIDO', prioridade: 'high', dataVencimento: '2026-06-05', responsavel: 'Joao Silva' },
    { titulo: 'Envio DARFs Mensais', descricao: 'Efetuar pagamentos dos DARFs pendentes', status: 'PENDENTE', prioridade: 'high', dataVencimento: '2026-06-15', responsavel: 'Ana Costa' },
    { titulo: 'Atualizacao Plano de Contas', descricao: 'Verificar e atualizar plano de contas conforme normas', status: 'PENDENTE', prioridade: 'low', dataVencimento: '2026-07-31', responsavel: 'Maria Santos' },
    { titulo: 'Backup Sistema', descricao: 'Realizar backup completo do sistema', status: 'CONCLUIDO', prioridade: 'medium', dataVencimento: '2026-06-01', responsavel: 'Eduardo Gomes' },
    { titulo: 'Treinamento Equipe', descricao: 'Treinar equipe sobre novas funcionalidades', status: 'PENDENTE', prioridade: 'low', dataVencimento: '2026-07-15', responsavel: 'Roberto Almeida' },
    { titulo: 'Relatorio DRE Mensal', descricao: 'Gerar Demonstracao do Resultado do Exercicio', status: 'PENDENTE', prioridade: 'medium', dataVencimento: '2026-07-10', responsavel: 'Ana Costa' },
    { titulo: 'Certificado Digital', descricao: 'Verificar validade do certificado digital A1', status: 'PENDENTE', prioridade: 'low', dataVencimento: '2026-08-15', responsavel: 'Eduardo Gomes' },
    { titulo: 'Conferencia FGTS', descricao: 'Conferir guias FGTS dos funcionarios', status: 'EM_PROGRESSO', prioridade: 'medium', dataVencimento: '2026-06-20', responsavel: 'Patricia Ribeiro' },
  ];

  for (const tarefa of kanbanTarefas) {
    await prisma.kanbanTarefa.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...tarefa,
      },
    });
  }

  console.log('Kanban tarefas criadas:', kanbanTarefas.length);

  // Criar 12 notificacoes
  const notificacoes = [
    { titulo: 'Vencimento DARF', mensagem: 'DARF IRPJ vence em 15 dias', tipo: 'WARNING', lida: false, link: '/calendario' },
    { titulo: 'Nota Fiscal Pendente', mensagem: 'NF-e 123 ainda nao foi autorizada', tipo: 'WARNING', lida: false, link: '/fiscal/notas-fiscais' },
    { titulo: 'Conta a Pagar Atrasada', mensagem: 'Condominio esta atrasado', tipo: 'ERROR', lida: false, link: '/financeiro/pagar' },
    { titulo: 'Backup Realizado', mensagem: 'Backup diario concluido com sucesso', tipo: 'SUCCESS', lida: true },
    { titulo: 'eSocial Enviado', mensagem: 'Evento S-1200 enviado com sucesso', tipo: 'SUCCESS', lida: true },
    { titulo: 'Prazo SPED EFD', mensagem: 'SPED EFD vence em 30 dias', tipo: 'INFO', lida: false, link: '/fiscal/sped' },
    { titulo: 'Novo Funcionario', mensagem: 'Camila Araujo cadastrada no sistema', tipo: 'INFO', lida: true },
    { titulo: 'Certificado Digital', mensagem: 'Certificado A1 vence em 60 dias', tipo: 'WARNING', lida: false, link: '/sistema/certidoes' },
    { titulo: 'Relatorio Mensal', mensagem: 'DRE de junho disponivel', tipo: 'INFO', lida: true, link: '/contabil/dre' },
    { titulo: 'Conciliacao Pendente', mensagem: 'Existem 5 movimentacoes nao conciliadas', tipo: 'WARNING', lida: false, link: '/financeiro/fluxo-caixa' },
    { titulo: 'FGTS Vencido', mensagem: 'Guia FGTS do mes anterior ainda pendente', tipo: 'ERROR', lida: false, link: '/calendario' },
    { titulo: 'Sistema Atualizado', mensagem: 'ContaFlow atualizado para versao 1.0.1', tipo: 'SUCCESS', lida: true },
  ];

  for (const notif of notificacoes) {
    await prisma.notificacoes.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        usuarioId: usuario.id,
        ...notif,
      },
    });
  }

  console.log('Notificacoes criadas:', notificacoes.length);

  // Criar 8 integracoes governo
  const integracoes = [
    { tipo: 'SPED_ECD', descricao: 'Escrituracao Contabil Digital', status: 'ATIVO', ultimaExecucao: new Date('2026-06-01') },
    { tipo: 'SPED_EFD_ICMS', descricao: 'SPED EFD ICMS IPI', status: 'ATIVO', ultimaExecucao: new Date('2026-06-01') },
    { tipo: 'ESOCIAL', descricao: 'eSocial - Eventos Trabalhistas', status: 'ATIVO', ultimaExecucao: new Date('2026-06-10') },
    { tipo: 'NFE', descricao: 'Nota Fiscal Eletronica', status: 'ATIVO', ultimaExecucao: new Date('2026-06-20') },
    { tipo: 'NFSE', descricao: 'Nota Fiscal de Servico Eletronica', status: 'PENDENTE' },
    { tipo: 'DCTFWEB', descricao: 'Declaracao de Creditos e Tributos Federais', status: 'PENDENTE' },
    { tipo: 'CERTIDAO_CONJUNTA', descricao: 'Consulta Certidoes Conjuntas', status: 'ATIVO', ultimaExecucao: new Date('2026-06-05') },
    { tipo: 'SIMPLES_NACIONAL', descricao: 'Simples Nacional - DAS', status: 'INATIVO' },
  ];

  for (const integ of integracoes) {
    await prisma.integracoesGoverno.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...integ,
      },
    });
  }

  console.log('Integracoes governo criadas:', integracoes.length);

  // Criar movimentacoes bancarias
  const movimentacoes = [
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Receita Cliente Alpha', valor: 15000, tipo: 'CREDITO', dataMovimento: new Date('2026-06-01'), conciliado: true },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Pagamento Aluguel', valor: -8500, tipo: 'DEBITO', dataMovimento: new Date('2026-06-01'), conciliado: true },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Receita Cliente Beta', valor: 8500, tipo: 'CREDITO', dataMovimento: new Date('2026-06-03'), conciliado: true },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Pagamento Energia', valor: -2300, tipo: 'DEBITO', dataMovimento: new Date('2026-06-05'), conciliado: false },
    { contaBancariaId: contasBancariasCriadas[1].id, descricao: 'Receita Cliente Gamma', valor: 45000, tipo: 'CREDITO', dataMovimento: new Date('2026-06-07'), conciliado: true },
    { contaBancariaId: contasBancariasCriadas[1].id, descricao: 'Pagamento Internet', valor: -890, tipo: 'DEBITO', dataMovimento: new Date('2026-06-10'), conciliado: false },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Receita Cliente Delta', valor: 6000, tipo: 'CREDITO', dataMovimento: new Date('2026-06-12'), conciliado: false },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Pagamento Material', valor: -1200, tipo: 'DEBITO', dataMovimento: new Date('2026-06-14'), conciliado: false },
    { contaBancariaId: contasBancariasCriadas[2].id, descricao: 'Transferencia Conta Poupanca', valor: 5000, tipo: 'CREDITO', dataMovimento: new Date('2026-06-15'), conciliado: true },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Pagamento Limpeza', valor: -1800, tipo: 'DEBITO', dataMovimento: new Date('2026-06-18'), conciliado: false },
    { contaBancariaId: contasBancariasCriadas[1].id, descricao: 'Receita Cliente Epsilon', valor: 25000, tipo: 'CREDITO', dataMovimento: new Date('2026-06-20'), conciliado: false },
    { contaBancariaId: contasBancariasCriadas[0].id, descricao: 'Pagamento Contabilidade', valor: -3500, tipo: 'DEBITO', dataMovimento: new Date('2026-06-22'), conciliado: false },
  ];

  for (const mov of movimentacoes) {
    await prisma.movimentacaoBancaria.create({
      data: {
        empresaId: empresa.id,
        tenantId: empresa.tenantId,
        ...mov,
      },
    });
  }

  console.log('Movimentacoes bancarias criadas:', movimentacoes.length);

  console.log('\n========================================');
  console.log('SEED CONCLUIDO COM SUCESSO!');
  console.log('========================================');
  console.log('Resumo dos dados criados:');
  console.log('- 1 Empresa');
  console.log('- 1 Usuario Admin (admin@contaflow.com.br / admin123)');
  console.log('- 20 Contas Contabeis');
  console.log('- 15 Funcionarios');
  console.log('- 5 Contas Bancarias');
  console.log('- 15 Contas a Pagar');
  console.log('- 15 Contas a Receber');
  console.log('- 15 Notas Fiscais');
  console.log('- 15 Lancamentos Contabeis');
  console.log('- 12 Eventos eSocial');
  console.log('- 12 Calendario Fiscal');
  console.log('- 12 Kanban Tarefas');
  console.log('- 12 Notificacoes');
  console.log('- 8 Integracoes Governo');
  console.log('- 12 Movimentacoes Bancarias');
  console.log('========================================');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
