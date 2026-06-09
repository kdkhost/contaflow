# Graph Report - contaflow  (2026-06-09)

## Corpus Check
- 92 files · ~25,613 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 652 nodes · 1231 edges · 33 communities (29 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]

## God Nodes (most connected - your core abstractions)
1. `getDatabase()` - 60 edges
2. `AuthService` - 23 edges
3. `formatCurrencyFromNumber()` - 23 edges
4. `compilerOptions` - 19 edges
5. `ContasReceberPage()` - 19 edges
6. `FuncionariosPage()` - 19 edges
7. `notifyError()` - 19 edges
8. `compilerOptions` - 18 edges
9. `AuthController` - 16 edges
10. `scripts` - 15 edges

## Surprising Connections (you probably didn't know these)
- `CalendarioFiscalPage()` --calls--> `getDatabase()`  [EXTRACTED]
  frontend/src/pages/Fiscal/CalendarioFiscalPage.tsx → backend/src/utils/database.ts
- `DREPage()` --calls--> `formatCurrencyFromNumber()`  [EXTRACTED]
  frontend/src/pages/Contabil/DREPage.tsx → frontend/src/utils/masks.ts
- `bootstrap()` --calls--> `setupRoutes()`  [EXTRACTED]
  backend/src/index.ts → backend/src/api/routes/index.ts
- `bootstrap()` --calls--> `setupWorkers()`  [EXTRACTED]
  backend/src/index.ts → backend/src/workers/index.ts
- `bootstrap()` --calls--> `setupScheduler()`  [EXTRACTED]
  backend/src/index.ts → backend/src/scheduler/index.ts

## Communities (33 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (20): ContabilController, contaContabilSchema, lancamentoSchema, DashboardController, FinanceiroController, FiscalController, GraphifyController, IntegracoesController (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (37): AuthService, LoginInput, RegisterInput, TokenPair, AuthController, changePasswordSchema, loginSchema, refreshTokenSchema (+29 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (16): devDependencies, jest, prisma, supertest, tsx, @types/bcryptjs, @types/crypto-js, @types/jest (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (36): build, appId, directories, files, linux, mac, nsis, productName (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (47): dependencies, bcryptjs, bullmq, crypto-js, date-fns, dotenv, fastify, @fastify/cors (+39 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): compilerOptions, baseUrl, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, lib, module (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (26): dependencies, admin-lte, axios, chart.js, date-fns, date-fns-tz, @fullcalendar/core, @fullcalendar/daygrid (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, postcss, tailwindcss, @types/react (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (50): AddressInput(), AddressInputProps, ufOptions, MaskedInputProps, maskFunctions, ModalFooter(), ModalFooterProps, ModalProps (+42 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (43): EmptyState(), EmptyStateProps, LoadingProps, sizeClasses, BalancoPage(), DREPage(), DashboardPage(), FluxoCaixaPage() (+35 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (23): 1. Modo Navegador (localhost/rede), 2. Modo Windows (Electron), 3. Modo Portatil (Pendrive), code:bash (# Clonar repositorio), code:bash (# Build do frontend), code:bash (# Build do frontend), code:bash (# Build do frontend), code:bash (# Iniciar todos os servicos) (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): description, devDependencies, concurrently, engines, node, name, private, scripts (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (9): [1.0.0] - 2026-06-08, Adicionado, Changelog - ContaFlow, Documentacao, Funcionalidades, Infraestrutura, Integracoes, Seguranca (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (13): bin, description, devDependencies, pkg, name, pkg, assets, outputPath (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (4): HeaderProps, LayoutProps, menuItems, SidebarProps

### Community 18 - "Community 18"
Cohesion: 0.31
Nodes (9): checkServer(), { exec, spawn }, fs, http, main(), openBrowser(), path, startServer() (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): auditLog, files, hashType, keep, amount, days

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (3): { app, BrowserWindow, Tray, Menu, nativeImage }, path, { spawn }

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (6): auditLog, files, hashType, keep, amount, days

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (6): Backend, Docker Compose, Frontend, Icon, HTML File, SVG File

### Community 25 - "Community 25"
Cohesion: 0.36
Nodes (7): KanbanBoard(), KanbanBoardProps, KanbanColumn, KanbanItem, priorityColors, colunas, Tarefa

### Community 26 - "Community 26"
Cohesion: 0.60
Nodes (4): CalendarEvent, ContaFlowCalendar(), ContaFlowCalendarProps, calendarConfig

## Knowledge Gaps
- **291 isolated node(s):** `name`, `version`, `description`, `private`, `dev` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDatabase()` connect `Community 0` to `Community 1`, `Community 9`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `CalendarioFiscalPage()` connect `Community 9` to `Community 0`, `Community 10`, `Community 26`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `IntegracoesPage()` connect `Community 10` to `Community 0`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05648148148148148 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06874717322478517 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._