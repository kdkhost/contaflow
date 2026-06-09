# Changelog - ContaFlow

Todos os cambios importantes neste projeto serao documentados neste arquivo.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-06-08

### Adicionado
- Estrutura completa do projeto ContaFlow
- Backend com Node.js, Fastify, TypeScript e Prisma
- Frontend com React 18, TypeScript, AdminLTE 4 e TailwindCSS
- Schema Prisma com todos os modelos (empresas, usuarios, contas_contabeis, lancamentos, notas_fiscais, funcionarios, eventos_esocial, logs_auditoria, graphify_mapas, integracoes_governo)
- Sistema de autenticacao JWT com refresh token
- Multi-tenant com middleware automatico
- Middleware de auditoria global
- Modulos: Contabil, Fiscal, Pessoal, Financeiro, Graphify, Integracoes
- Worker eSocial com BullMQ
- Scheduler com node-cron para obrigacoes acessorias
- Integracao Graphify com react-flow-renderer
- Mapas visuais: Plano de Contas, Fluxo Fiscal, Fluxo Trabalhista, Integracoes
- Dashboard com graficos interativos
- Tema dark/light com toggle persistente
- CSS premium com glassmorphism e gradientes
- Docker Compose com PostgreSQL, Redis, Nginx e App
- Configuracao Electron para modo desktop
- Script portatil para pendrive
- RBAC com 5 perfis: admin, contador_chefe, contador_analista, auxiliar, cliente_visualizacao
- Logs centralizados com Winston
- Backup criptografado

### Funcionalidades
- Contabil: Plano de contas hierarquico, lancamentos D/C, DRE, Balanco
- Fiscal: Apuracao ICMS/PIS/COFINS, notas fiscais, EFD, SPED
- Pessoal: Funcionarios, folha de pagamento, eSocial, ferias, rescisoes
- Financeiro: Contas a pagar/receber, fluxo de caixa, conciliacao bancaria
- Graphify: Mapeamentos visuais interativos com zoom, pan e clique para detalhes
- Integracoes: SPED, eSocial, NF-e, DCTFWeb, EFD-Reinf, Simples Nacional, Certidoes

### Integracoes
- SPED (ECD, ECF, EFD ICMS/IPI, EFD PIS/COFINS)
- eSocial (S-1200, S-1299)
- NF-e/NFC-e/NFS-e
- DCTFWeb
- EFD-Reinf
- Simples Nacional (DAS)
- Certidoes Conjuntas (FGTS/INSS/Fazenda)
- e-CAC
- Sintegra
- CND automatica

### Seguranca
- Multi-tenant com tenant_id em todas as tabelas
- RBAC com controle de permissoes granulares
- Trilha de auditoria completa
- Logs centralizados
- Backup criptografado

### Workers e Automacoes
- Cron jobs diarios para certidoes (6h da manha)
- Scheduler para obrigacoes acessorias
- Webhooks para XMLs recebidos
- Fila de tarefas com BullMQ

### Infraestrutura
- Docker Compose com PostgreSQL, Redis, Nginx
- PM2 para gerenciamento de processos
- Configuracao Nginx para proxy reverso

### Documentacao
- README.md completo com passo a passo de instalacao
- Modo dev, build electron, build portatil
- Schema Prisma documentado