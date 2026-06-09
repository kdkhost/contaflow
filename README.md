# ContaFlow - Sistema Contabil Completo

Sistema contabil completo com multi-tenant, Graphify para mapeamentos visuais e integracao com portais do governo.

## Funcionalidades

- **Contabil**: Plano de contas hierarquico, lancamentos D/C, DRE, Balanco
- **Fiscal**: Apuracao de impostos (ICMS, PIS, COFINS), EFD, SPED
- **Pessoal**: Funcionarios, folha de pagamento, eSocial, ferias, rescisoes
- **Financeiro**: Contas a pagar/receber, fluxo de caixa, conciliacao bancaria
- **Graphify**: Mapeamentos visuais interativos com react-flow-renderer
- **Integracoes**: SPED, eSocial, NF-e, DCTFWeb, EFD-Reinf, Simples Nacional

## Tecnologias

- **Backend**: Node.js + Fastify + TypeScript + Prisma + PostgreSQL/SQLite
- **Frontend**: React 18 + TypeScript + TailwindCSS + Graphify
- **Auth**: JWT + Refresh Token
- **Infra**: Docker + Redis + BullMQ + Nginx

## Instalacao

### Pre-requisitos
- Node.js 20+
- PostgreSQL 14+ (ou SQLite para modo portable)
- Redis (opcional, para workers)

### Modo Desenvolvimento

```bash
# Clonar repositorio
git clone https://github.com/seu-usuario/contaflow.git
cd contaflow

# Instalar dependencias
npm install

# Configurar ambiente
cp backend/.env.example backend/.env

# Gerar Prisma
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed

# Iniciar em modo dev
npm run dev
```

Acesse: http://localhost:5173

### Credenciais Padrao
- Email: admin@contaflow.com.br
- Senha: admin123
- Tenant: contaflow-default

## Modos de Implantacao

### 1. Modo Navegador (localhost/rede)

```bash
# Build do frontend
cd frontend
npm run build

# Iniciar backend
cd ../backend
npm run build
npm start
```

Acesse: http://localhost:3333

### 2. Modo Windows (Electron)

```bash
# Build do frontend
cd frontend
npm run build

# Copiar frontend para desktop/electron/frontend/
cp -r dist ../desktop/electron/frontend/

# Build do Electron
cd ../desktop/electron
npm install
npm run build:win
```

O executavel sera gerado em `desktop/electron/dist-electron/`

### 3. Modo Portatil (Pendrive)

```bash
# Build do frontend
cd frontend
npm run build

# Build do backend para executavel
cd ../backend
npm install -g pkg
pkg dist/index.js --targets node20-win-x64 --output ../desktop/portable/server/index.js

# Build do pacote portatil
cd ../desktop/portable
npm install
npm run build
```

O executavel portatil sera gerado em `desktop/portable/dist-portable/`

## Docker

```bash
# Iniciar todos os servicos
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## Graphify - Mapeamentos Visuais

O sistema inclui mapeamentos visuais interativos:

- **Mapa Contabil**: Arvore hierarquica do plano de contas
- **Mapa Fiscal**: Fluxo de apuracao (ICMS -> PIS -> COFINS -> IRPJ/CSLL)
- **Mapa Trabalhista**: Fluxo eSocial (evento -> processamento -> resposta)
- **Integracoes**: Relacionamento com portais do governo

Funcionalidades:
- Zoom e pan nos graficos
- Clique nos nos para detalhes
- Exportacao PNG/PDF
- Tooltips informativos

## Integracoes com Portais

- SPED (ECD, ECF, EFD ICMS/IPI, EFD PIS/COFINS)
- eSocial (S-1200, S-1299)
- NF-e/NFC-e/NFS-e
- DCTFWeb
- EFD-Reinf
- Simples Nacional (DAS)
- Certidoes Conjuntas
- e-CAC
- Sintegra
- CND automatica

## Seguranca

- Multi-tenant com tenant_id em todas as tabelas
- RBAC com 5 perfis de acesso
- Trilha de auditoria completa
- Logs centralizados com Winston
- Backup criptografado

## Estrutura do Projeto

```
contaflow/
├── backend/
│   └── src/
│       ├── api/         # Controllers, routes, middlewares
│       ├── core/        # Auth, multi-tenant, auditoria
│       ├── modules/     # Modulos funcionais
│       ├── workers/     # BullMQ workers
│       ├── scheduler/   # Node-cron jobs
│       └── utils/       # Utilitarios
├── frontend/
│   └── src/
│       ├── components/  # Componentes React
│       ├── pages/       # Paginas
│       ├── hooks/       # Hooks customizados
│       ├── services/    # Servicos API
│       └── store/       # Estado global
├── desktop/
│   ├── electron/        # Modo desktop
│   └── portable/        # Modo pendrive
├── docker/              # Docker Compose
└── scripts/             # Scripts auxiliares
```

## Licenca

MIT