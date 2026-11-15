# Plano de implementação — Conexão da API ao site Vôlei

Objetivo deste plano
- Ler e comentar a API existente conforme solicitado em docs/espicificacacao.md;
- Planejar as alterações mínimas necessárias para permitir: cadastro, login e uma dashboard unificada que troque comentários e totais ao alterar um select;
- Apontar arquivos afetados, bugs/risks e passos de implementação com prioridade e estimativa.

Resumo do que já existe (observado no código)
- Backend: Node/Express com rotas em src/routes e controllers em src/controllers.
- Models em src/models usam src/database/config.js para executar SQL diretamente.
- Endpoints relevantes já presentes: /usuarios/cadastrar, /usuarios/autenticar, /avisos/* (listar, publicar, editar, deletar, listar/:idUsuario, pesquisar/:descricao), /empresas/*, /aquarios/:empresaId, /medidas/*.
- Frontend: páginas em public/ (login.html, cadastro.html, dashboard/*) que usam fetch para consumir esses endpoints.

Principais observações e riscos imediatos
- A camada de models monta SQL concatenando strings com valores do usuário (ex.: `WHERE u.id = ${idUsuario}` ou `VALUES ('${titulo}', '${descricao}', ${idUsuario})`). Risco de SQL injection. Recomendação: usar queries parametrizadas (prepared statements) ou escapar/validar entradas antes de concatenar.
- database/config.js espera variáveis de ambiente (DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT) e exige AMBIENTE_PROCESSO definido como "desenvolvimento" ou "producao". Antes de testar, ajustar .env ou process.env.
- Pequena inconsistência: rota em src/routes/aquarios.js é `router.get('/:empresaId')` mas em aquarioController.buscarAquariosPorEmpresa o código lê `var idUsuario = req.params.idUsuario;` — isso provavelmente resulta em undefined. Deve padronizar o nome do parâmetro (ex.: `:empresaId` e usar empresaId no controller) — isso impede que a listagem de aquários funcione corretamente.
- Senhas são tratadas em texto claro (persistidas/retornadas em alguns endpoints). Ideal: nunca retornar a senha em respostas e armazenar senha com hash (bcrypt). Como o escopo pede não mudar estrutura, mencionar como melhoria e, no mínimo, evitar enviar `senha` nos objetos de resposta.

API — comentário e explicação por endpoint (comportamento atual)

1) Usuários
- POST /usuarios/cadastrar
  - Corpo (JSON): { nomeServer, emailServer, senhaServer, idEmpresaVincularServer }
  - Comportamento: valida campos, chama usuarioModel.cadastrar(nome, email, senha, fkEmpresa) e retorna o resultado do banco (JSON). Em caso de erro, retorna 500 com a mensagem do SQL.
  - Pontos de atenção: validação básica já existe. Confirmar nomes das chaves no front (cadastro.html usa os mesmos nomes). Verificar que idEmpresaVincularServer corresponde ao fk_empresa na tabela.

- POST /usuarios/autenticar
  - Corpo (JSON): { emailServer, senhaServer }
  - Comportamento: valida campos, chama usuarioModel.autenticar(email, senha). Se exatamente 1 resultado: busca aquários da empresa do usuário (aquarioModel.buscarAquariosPorEmpresa(resultado[0].empresaId)) e retorna um objeto contendo id, email, nome, senha e aquarios. Se 0 -> 403 (credenciais); se >1 -> 403 (duplicidade).
  - Pontos de atenção: a resposta inclui `senha` na versão atual — remova esse campo nas respostas para evitar exposição; idealmente hashear senhas no cadastro e comparar hash no login.

2) Avisos (mural / comentários)
- GET /avisos/listar
  - Retorna todos os avisos com dados do usuário (join com usuario). Se sem resultados, 204.

- GET /avisos/listar/:idUsuario
  - Retorna avisos publicados pelo usuário informado.

- GET /avisos/pesquisar/:descricao
  - Retorna avisos cujo campo descricao LIKE '${texto}' (atenção ao LIKE sem curingas na chamada atual; front deve enviar %texto% ou backend deve aplicar `%${texto}%`). Risco de SQL injection pela interpolação direta.

- POST /avisos/publicar/:idUsuario
  - Corpo (JSON): { titulo, descricao }
  - Publica um aviso vinculado ao idUsuario (param URL). Valida presença de título/descrição/idUsuario.

- PUT /avisos/editar/:idAviso
  - Corpo (JSON): { descricao } — atualiza descrição.

- DELETE /avisos/deletar/:idAviso
  - Deleta aviso pelo id.

3) Empresas
- POST /empresas/cadastrar
  - Corpo (JSON): { cnpj, razaoSocial }
  - Primeiro verifica se já existe empresa com cnpj (buscarPorCnpj), se existir retorna 401, senão insere.

- GET /empresas/buscar?cnpj=...
  - Retorna empresa(s) com o CNPJ informado.

- GET /empresas/buscar/:id
  - Retorna empresa por id.

- GET /empresas/listar
  - Retorna todas as empresas.

4) Aquários
- GET /aquarios/:empresaId
  - Busca aquários associados a uma empresa (no controller há inconsistência no nome do parâmetro — corrigir). Retorna 200 com array ou 204 com array vazio.

- POST /aquarios/cadastrar
  - Corpo (JSON): { descricao, idUsuario } (o controller valida). Insere e retorna 201.

5) Medidas (relacionado a gráficos)
- GET /medidas/ultimas/:idAquario
  - Retorna últimas N medidas (limite hard-coded em controller: 7) para montar gráfico.

- GET /medidas/tempo-real/:idAquario
  - Retorna últimas medidas em tempo real (usado em atualização periódica).

Pontos críticos de segurança e robustez
- SQL injection por concatenação direta. Trocar por queries parametrizadas (mysql2 suporta placeholders `?`) ou ao menos sanitizar entradas.
- Variáveis de ambiente obrigatórias; documentar .env esperado.
- Não retornar senhas nas respostas; remover do SELECT nos models quando não for necessário. No avisoModel, a query faz SELECT u.senha — evitar isso.

Plano de implementação (passos mínimos e não intrusivos)
Prioridade alta (corrigir para permitir login/cadastro e dashboard funcional):
1. Preparação do ambiente
   - Criar/atualizar .env (ou dev.env) com DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT e AMBIENTE_PROCESSO=desenvolvimento.
   - Testar conexão com `npm start` e observar mensagens de erro no console (database/config.js imprime instruções SQL e erros).

2. Corrigir inconsistência de rota/param em aquários
   - Ajustar src/routes/aquarios.js ou src/controllers/aquarioController.js para usar o mesmo nome de parâmetro. Recomendo alterar o controller para usar `var empresaId = req.params.empresaId;` (mudança localizada).

3. Evitar expor senha nas respostas
   - Nos controllers (principalmente usuarioController.autenticar e avisoModel.listar), remover a propriedade senha do objeto retornado antes de enviar ao cliente. Ex.: construir objeto de resposta sem senha.

4. Dashboard unificada (front-end)
   - Criar uma única página em public/dashboard/unico.html (ou adaptar public/dashboard/dashboard.html) com um <select> com opções de locais (ex: empresas ou locais predefinidos).
   - Ao selecionar um local, enviar fetch para um endpoint que retorne comentários e total de comentários para aquele local.
       - Opção A (mínima / sem mudar muito backend): Reutilizar /avisos/listar e filtrar no cliente pelos avisos relacionados (mas os avisos atuais não parecem ter vínculo direto com local). Se a model tiver fk_local/fk_aquario/empresa, pode usar isso; caso contrário, é necessário adicionar um campo de vínculo ou um endpoint que aceite localId.
       - Opção B (melhor): Adicionar endpoint GET /avisos/por_local/:localId que retorne os avisos e o total (ou GET /avisos/count/por_local/:localId). Isso implica adicionar uma coluna no banco ou usar relação já existente (precisar inspecionar esquema). Esse passo pode exigir alteração de model/SQL.
   - Atualizar a listagem de comentários na página e o contador total quando o select mudar.

5. Testar fluxo de cadastro e login
   - Testar public/cadastro.html -> POST /usuarios/cadastrar
   - Testar public/login.html -> POST /usuarios/autenticar
   - Verificar respostas e se aquarios são retornados conforme esperado.

6. Melhorias de segurança (recomendadas, não obrigatórias agora)
   - Hash de senhas (bcrypt) ao cadastrar e comparar hash no autenticar.
   - Trocar queries por parametrizadas (ex.: database.executar com mysql2 prepared statements ou usando pool.execute).
   - Remover exposição de campos sensíveis nas queries (evitar SELECT u.senha quando não necessário).

Alterações propostas por arquivo (resumo)
- src/database/config.js: documentar variáveis de ambiente e AMBIENTE_PROCESSO; considerar uso de pool em vez de createConnection a cada query.
- src/routes/aquarios.js: (pequena correção de nome do parâmetro ou comentar alteração) - manter estrutura; ajuste de 1 linha.
- src/controllers/usuarioController.js: filtrar campo senha da resposta; adicionar comentários explicativos sobre o fluxo.
- src/models/*Model.js: (opcional neste passo) anotar risco de SQL injection e planejar refatoração para queries parametrizadas.
- public/dashboard/*: unificar telas em uma única página com select e chamadas JS para atualizar comentários e totais de acordo com a seleção.
- public/login.html e public/cadastro.html: já fazem fetch para os endpoints corretos; garantir tratamento de respostas e mensagens de erro no DOM.

Checklist de implementação (ordem sugerida)
1. Preparar .env / dev.env e garantir banco acessível
2. Corrigir parâmetro empresaId / idUsuario (aquarios)
3. Remover senha de respostas (usuarioController, avisoModel)
4. Criar/alterar página do dashboard unificado e implementar fetch para comentários/contagem
5. Testes manuais: cadastro -> login -> visualizar dashboard com troca de select
6. Escrever notas/documentação (README ou docs) com instruções de ambiente e endpoints principais

Estimativa de esforço (apenas orientação)
- Preparar ambiente e testes iniciais: 0.5 — 1h
- Corrigir bug de parâmetro e remoção de senha na resposta: 0.5 — 1h
- Implementar dashboard unificado (front-end + possivelmente endpoint mínimo): 1 — 3h (dependendo se é preciso criar endpoint no backend)
- Melhorias de segurança (hash + parametrização): 2 — 4h

Observações finais e próximos passos
- Posso implementar as mudanças mínimas agora (corrigir parâmetro em aquarios, remover senha de respostas e adicionar o arquivo de plano no repo) se você autorizar. Para mudanças no banco (novas colunas ou relacionamentos) preciso da sua autorização explícita.
- Se preferir, primeiro eu faço só a documentação detalhada da API (endpoints, exemplos de requests/responses) em outro arquivo para que possamos validar antes de editar código.

---

Assinado: OpenCode (autoria do plano gerado a partir de leitura de docs/espicificacacao.md e inspeção do código).
