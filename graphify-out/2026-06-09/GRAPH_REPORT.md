# Graph Report - .  (2026-06-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 552 nodes · 839 edges · 34 communities (30 shown, 4 thin omitted)
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
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]

## God Nodes (most connected - your core abstractions)
1. `getDatabase()` - 53 edges
2. `AuthService` - 21 edges
3. `compilerOptions` - 18 edges
4. `compilerOptions` - 18 edges
5. `ContasReceberPage()` - 18 edges
6. `FuncionariosPage()` - 18 edges
7. `scripts` - 15 edges
8. `AuthController` - 14 edges
9. `LancamentosPage()` - 14 edges
10. `CalendarioFiscalPage()` - 14 edges

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

## Communities (34 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (15): contaContabilSchema, lancamentoSchema, FiscalController, PessoalController, registrarAuditoria(), authRoutes(), contabilRoutes(), dashboardRoutes() (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (35): AuthService, LoginInput, RegisterInput, TokenPair, AuthController, changePasswordSchema, loginSchema, refreshTokenSchema (+27 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (34): description, devDependencies, jest, prisma, supertest, tsx, @types/bcryptjs, @types/crypto-js (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (31): build, appId, directories, files, linux, mac, nsis, productName (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (27): dependencies, bcryptjs, bullmq, crypto-js, date-fns, dotenv, fastify, @fastify/cors (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): compilerOptions, baseUrl, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (25): dependencies, admin-lte, axios, chart.js, date-fns, date-fns-tz, @fullcalendar/core, @fullcalendar/daygrid (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, postcss, tailwindcss, @types/react (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (16): AddressInput(), AddressInputProps, ufOptions, maskFunctions, buscarCEP(), EnderecoViaCEP, maskCard(), maskCEP() (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (16): EmptyState(), LoadingProps, sizeClasses, BalancoPage(), DREPage(), DashboardPage(), FluxoCaixaPage(), ApuracaoPage() (+8 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (12): Certidao, CertidoesPage(), statusColors, tipoLabels, GestaoIntegracoesPage(), Integracao, tipoLabels, baseConfig (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): description, devDependencies, concurrently, engines, node, name, private, scripts (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (14): LoginPage(), LoginPageProps, colunas, Tarefa, defaultStyle, getStyle(), lightStyle, notifyDismiss() (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (15): IntegracoesPage(), nodeTypes, MapaContabilPage(), nodeTypes, MapaFiscalPage(), nodeTypes, MapaTrabalhistaPage(), nodeTypes (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.19
Nodes (15): ModalFooter(), ModalFooterProps, initialForm, LancamentosPage(), ContaReceber, ContasReceberPage(), initialForm, CalendarioFiscalPage() (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (12): bin, description, devDependencies, name, pkg, assets, outputPath, scripts (+4 more)

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

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (4): ContaContabil, initialForm, ContaPagar, initialForm

### Community 25 - "Community 25"
Cohesion: 0.40
Nodes (5): KanbanBoard(), KanbanBoardProps, KanbanColumn, KanbanItem, priorityColors

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (4): CalendarEvent, ContaFlowCalendar(), ContaFlowCalendarProps, calendarConfig

## Knowledge Gaps
- **297 isolated node(s):** `name`, `version`, `description`, `private`, `dev` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDatabase()` connect `Community 0` to `Community 1`, `Community 15`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `CalendarioFiscalPage()` connect `Community 15` to `Community 0`, `Community 10`, `Community 11`, `Community 13`, `Community 14`, `Community 26`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `IntegracoesPage()` connect `Community 14` to `Community 0`, `Community 10`, `Community 11`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05268065268065268 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06453634085213032 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._