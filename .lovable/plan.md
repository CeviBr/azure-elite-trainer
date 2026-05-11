## Pente fino e correções

### 1. Botão "Sair" duplicado
Hoje há **dois** botões SAIR:
- Um no React (`src/pages/Index.tsx`, canto superior direito sobre o iframe).
- Outro dentro do `public/app.html` (header, linha 527, `doLogout()`).

**Correção:** remover o botão flutuante do React. Manter apenas o do header do app (que já abre confirmação). O `doLogout()` do app passa a também limpar a sessão do shell React via `postMessage('logout')`, e o `Index.tsx` ouve esse evento e chama `logout() + setUser(null)`.

### 2. Sincronizar tudo entre Fabricio, Fabio e William (Lovable Cloud)
Hoje cada navegador é uma ilha (`localStorage`). O líder edita e ninguém mais vê. Vamos passar para o backend já existente:

| Dado | Tabela | Quem escreve | Quem lê |
|---|---|---|---|
| Plano da semana (dias × exercícios) | `workout_boxes` + `box_exercises` | líder | todos |
| Substituição de exercício | `box_exercises` (UPDATE name + subs) | quem treina (próprio) ou líder (global) | todos |
| Mensagem/aviso do líder | nova tabela `leader_notices` (id, message, by, created_at) | líder | todos (realtime) |
| Galeria de execução por exercício | nova tabela `exercise_media` (box_exercise_id, user_id, type, url, created_at) + bucket Storage `exec-media` | qualquer membro | todos |
| Logs de série (kg/reps/PR) | `workout_logs` (já existe) | usuário | todos (para gráfico do grupo) |
| Notas e mídias do calendário | nova tabela `calendar_entries` (user_id, day, note, media jsonb) | usuário | todos podem ver dos outros |

Realtime habilitado em `workout_boxes`, `box_exercises`, `leader_notices`, `exercise_media`, `workout_logs` para o app reagir sem refresh.

### 3. Substituição com escopo
Hoje `swapExercise` só altera localStorage local. Vamos oferecer dois modos no modal:
- **Só pra mim** → grava em `user_substitutions(user_id, box_exercise_id, new_name)` e o app sobrepõe ao renderizar.
- **Pra galera** (só líder) → atualiza a coluna `name` em `box_exercises`, dispara realtime e gera `leader_notices` automático: "Fabricio trocou X por Y".

### 4. Aviso ao editar treino
Toda mudança do líder (publicar treino, editar dia, mandar dica, trocar exercício para todos) cria registro em `leader_notices`. O sino do header pisca, badge incrementa, e ao abrir mostra a lista. Soldado online recebe toast em tempo real ("⚡ Fabricio atualizou Segunda — Peito + Tríceps").

### 5. Galeria de execuções (nova aba dentro do exercício)
- Cada card de exercício ganha aba **GALERIA** ao lado de Substituir/Guia.
- Mostra todas as mídias enviadas pelos 3 membros (com avatar de quem postou e data).
- Botão "Enviar minha execução" → upload pro bucket `exec-media`, salva em `exercise_media`. Realtime atualiza pra todos.
- Substitui o sistema atual de 3 slots locais (que era só do líder) por feed coletivo ilimitado, mantendo os 3 slots do líder como "referência oficial" (badge ⚡).

### 6. Calendário — bugs encontrados e correções
- `selectedCalDay` começa `undefined` → ao clicar em "salvar nota" antes de abrir um dia, salva `undefined: ...`. **Fix:** desabilitar botões enquanto não houver dia selecionado e default para hoje ao abrir a tela.
- `cal_medias` e `cal_notes` são por device, não por usuário → migra para `calendar_entries` com `user_id`.
- Mês não marca dias treinados de outros membros — adiciona toggle "Ver: eu / grupo" no header do calendário.
- Clique em mídia hoje **remove** sem confirmação (linha 2085) — trocar para abrir em modal grande; remoção só via botão ✕ explícito.
- `dot-green` ainda referencia a cor neon antiga removida do tema → usar `dot-gold` / `dot-mute` do design system atual.

### 7. Outros bugs encontrados na auditoria
- `pushWorkout` regrava `DEFAULT_WORKOUT_PLANS` por cima de dias que o líder não editou (linha 2473) — só publicar o que existe; manter os outros como estão.
- `finishWorkout` incrementa `streak` toda vez que selar, mesmo selando 2x no mesmo dia → checa data do último treino antes de incrementar.
- `goScreen('home', document.querySelector('.nav-btn'))` (linha 1883) seleciona **o primeiro** nav-btn (que é Home, ok) mas não atualiza estado se Home não for o primeiro — usar seletor `[data-screen="home"]`.
- Header do app tem `<img onerror>` que cai pra emoji, mas o `pfAvatar.appendChild(img)` dentro de `updateProfile` não limpa o avatar antigo entre trocas de aba (linha 2517 já limpa — ok), mas o mesmo padrão no header (linha ~520) **não** limpa → fantasma de avatar antigo após F5 com cache. Fix: `innerHTML=''` antes do append.
- Toggle "seguir líder" usa `var(--green)` que não existe mais no tema → usar `--gold`.
- `chartGroup` no Progresso usa cores hardcoded (`#ffd700`, `#ff6b6b`) — mover para variáveis CSS do tema.
- Sino de notificações nunca zera o contador ao abrir o painel.

### 8. Reconhecimento do usuário (já parcial)
Hoje o `?u=` no iframe só seta `currentUser`. Vamos usar isso também para:
- Pré-preencher upload de mídia / logs com `user_id` correto.
- Mostrar "OLÁ, ReisZo. Bom te ver de novo." baseado em `last_seen` salvo em `profiles`.

### 9. Detalhes técnicos (resumo)

```text
Migrações:
  + leader_notices(id, message, by, created_at)
  + exercise_media(id, box_exercise_id, user_id, kind, url, created_at)
  + user_substitutions(user_id, box_exercise_id, new_name, updated_at)
  + calendar_entries(user_id, day, note, media jsonb, updated_at)
  + storage bucket: exec-media (público read, write autenticado por user_id)
  realtime: ADD TABLE em todas as 5 tabelas-chave

Cliente:
  src/lib/cloud.ts — wrappers tipados Supabase (CRUD + subscribe)
  public/app.html — substituir get/setStore por chamadas async ao cloud,
                    suscrever realtime, ouvir 'logout' postMessage
  src/pages/Index.tsx — remover botão SAIR, adicionar listener postMessage
```

### Fora do escopo
- Autenticação Supabase real (mantém as 3 senhas locais por enquanto).
- Reescrita do `app.html` em React (continua iframe).
- Substituir o gradiente/granulado do tema.
