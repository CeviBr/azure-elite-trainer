## Objetivo

Trazer toda a estrutura funcional do `GANGST3R_Final.html` para o nosso projeto React, mantendo a identidade visual já existente (paleta preto/zinc, tipografia `Permanent Marker` + `Anton` + `Special Elite`, granulado SVG, sem o verde neon do mock). Funcionalmente, replicar 1:1 o que o HTML faz.

## Telas e funcionalidades a portar

**1. Login (`src/components/Login.tsx`)**
- 3 cards de perfil lado a lado (Fabricio LÍDER maior/destaque, Fábio e William SOLDADOS).
- Clique no card → expande input de senha → ENTRAR. Erro inline "Senha incorreta ✗".
- Mantém persistência do último nickname (já existe).

**2. App Shell (`src/pages/Index.tsx`)**
- Topbar: logo GANGST3R, avatar+nome+badge LÍDER, sino de notificações com badge, botão SAIR.
- Bottom nav (5 abas): Home · Treino · Progresso · Calendário · Perfil.

**3. Home (`src/components/screens/HomeScreen.tsx`)**
- Hero do dia (HOJE — SEGUNDA · PULL · FORÇA · músculos · botão "INICIAR TREINO").
- Banner de faltas (treinos pendentes da semana).
- Card de motivação (frase rotativa).
- Strip "treino do líder disponível" (quando líder publica).
- Stats grid (8 cards): streak, total, semana, último PR, faltas, volume, faltam treinos, dias treinados.
- Treinos rápidos (chips: Peito/Costas/Perna/Ombros/Core/Braços).
- Mensagem do líder.
- Card de hidratação (meta diária, barra, +150/+250/+500/−250).
- Feed de atividade recente.
- Painel "wallpaper do grupo" (apenas líder).

**4. Treino (`src/components/screens/WorkoutScreen.tsx`)**
- Header com título do dia + badge + navegação ANT/PRÓX.
- Tabs de semana (S1 Volume · S2 Intensidade · S3 Variação · S4 Deload).
- Timer do treino (play/pause/reset, mm:ss).
- Banner de sugestão de partes não treinadas.
- Lista de exercícios com séries (kg+reps por set), checkboxes de set concluído, botões de substituir/biblioteca/guia.
- Mini-hidratação fixa durante o treino.
- Botão "SELAR O TREINO" → modal de conclusão.
- Rest timer overlay.

**5. Progresso (`src/components/screens/ProgressScreen.tsx`)**
- 4 sub-abas: Evolução (2 charts: carga + volume por exercício), Médias (4 cards), Histórico (tabela), Grupo (chart comparativo dos 3).
- Usa Chart.js (instalar `chart.js` + `react-chartjs-2`).

**6. Calendário (`src/components/screens/CalendarScreen.tsx`)**
- Mês navegável, grid 7×N, dia clicável → painel detalhe com exercícios + nota.

**7. Perfil (`src/components/screens/ProfileScreen.tsx`)**
- Avatar grande, nome, role, stats pessoais, configurações (meta de água, etc.), logout.

**8. Editor do Líder (já existe, refinar)**
- Aba/modal extra para o líder definir o "treino do líder" pendente, com mensagem ao grupo.

**9. Modais reutilizáveis** (`src/components/modals/`)
- Rest Timer · Quest · Workout Done (celebração) · Substitute Exercise · Library · Notification Panel · Leader Quest · Guia Mídia · Calendar Day Report · Builtin Guia · Celebration Overlay.

## Camada de dados (`src/lib/`)

- `state.ts`: store leve com `zustand` para sessão, treinos por dia/semana, sets registrados, hidratação, notificações, mensagem do líder, atividade.
- Persistência em `localStorage` (já é o padrão do projeto). Sem backend.
- `workouts.ts`: estender com modelo de 4 semanas (Volume/Intensidade/Variação/Deload) e sets registrados (kg, reps, doneAt, PR flag).
- `quickWorkouts.ts`: presets de Peito/Costas/Perna/Ombros/Core/Braços.
- `motivation.ts`: array de frases rotativas.
- `hydration.ts`: meta + log diário.

## Design system

- **Sem verde neon `#00ff41`.** Substituir todos os destaques por:
  - Acento principal: branco quente / zinc-100.
  - Acento secundário (PR, sucesso): dourado fosco já usado (`gold-dim`).
  - Atenção/erro: vermelho discreto já existente.
- Manter granulado SVG, fontes (`Permanent Marker`/`Anton`/`Special Elite`), bordas retas (`rounded-none`), cards `bg-zinc-950 border-zinc-800`.
- Ícones `lucide-react` no lugar de emojis sempre que possível (manter alguns emojis quando o mock depende deles, ex.: 💧 hidratação, 🔥 streak).

## Dependências novas

- `chart.js` + `react-chartjs-2` (gráficos).
- `zustand` (store global leve).

## Ordem de execução

1. Instalar deps + criar store + libs de dados.
2. Refazer Login com seleção de perfil + senha inline.
3. Refazer Index como shell com bottom nav + roteamento interno por aba.
4. Implementar Home + Treino + Progresso + Calendário + Perfil em ordem.
5. Modais e overlays.
6. Editor do líder integrado ao novo modelo.

## Fora do escopo

- Backend / sincronização real entre usuários (continua tudo local por enquanto, como o HTML faz).
- Upload real de wallpaper (mantém UI mas guarda localmente).
- Autenticação Supabase (mantemos o login fixo atual).
