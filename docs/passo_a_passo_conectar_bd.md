# Passo a passo: conectar o site Vôlei ao banco de dados

Este documento mostra, em ordem prática, onde começar e exatamente o que alterar/testar para conectar o site ao banco de dados usando a API já presente no projeto. Também comento cada endpoint/arquivo principal e indico as linhas ou trechos que você deve revisar.

Pré-requisitos
- MySQL rodando e acesso (host, database, user, password, port).
- Node.js instalado.
- Ter o código deste repositório localmente.

1. Preparar variáveis de ambiente
- Crie um arquivo `.env` (ou `dev.env`) na raiz do projeto com as seguintes chaves:

  DB_HOST=localhost
  DB_DATABASE=nome_do_banco
  DB_USER=seu_usuario
  DB_PASSWORD=sua_senha
  DB_PORT=3306
  AMBIENTE_PROCESSO=desenvolvimento

- Por que: src/database/config.js lê essas variáveis para conectar ao MySQL. AMBIENTE_PROCESSO precisa ser "desenvolvimento" ou "producao".

2. Instalar dependências e iniciar a aplicação
- Rode:

  npm install
  npm start

- Verifique logs no console. O código atual imprime as instruções SQL executadas (útil para debug).

3. Testar endpoints básicos com curl/Postman
- Endpoints importantes para login/cadastro e comentários:
  - POST /usuarios/cadastrar
  - POST /usuarios/autenticar
  - GET /avisos/listar
  - POST /avisos/publicar/:idUsuario

- Exemplo (curl):

  curl -X POST http://localhost:3000/usuarios/autenticar \
    -H "Content-Type: application/json" \
    -d '{"emailServer":"seu@email","senhaServer":"123"}'

- Se receber 500 com mensagem do MySQL, verifique .env e se o servidor MySQL está ativo.

4. Onde revisar e alterar (comentários por arquivo)

- src/database/config.js
  - O que faz: cria conexão com MySQL, executa query e retorna promise.
  - O que verificar/alterar:
    - Confirme leitura das variáveis de ambiente (linhas: host/database/user/password/port).
    - Melhoria recomendada: usar pool (mysql2.createPool) para melhor performance e estabilidade, mas não obrigatório para começar.

- src/routes/usuarios.js -> src/controllers/usuarioController.js -> src/models/usuarioModel.js
  - O que faz: cadastra e autentica usuários.
  - Pontos para mudar/comentar:
    - usuarioController.autenticar monta resposta contendo `senha` do usuário. Não exponha senha. (arquivo: src/controllers/usuarioController.js — remover `senha` do objeto de resposta na linha onde res.json é enviado).
    - usuarioModel.cadastrar e autenticar atualmente podem armazenar e comparar senha em texto puro. Ideal: aplicar hashing com bcrypt ao cadastrar e comparar hash ao autenticar (arquivo: src/models/usuarioModel.js).

  - Exemplo de alteração mínima (controller):

    // antes de enviar a resposta
    var resp = {
      id: resultadoAutenticar[0].id,
      email: resultadoAutenticar[0].email,
      nome: resultadoAutenticar[0].nome,
      aquarios: resultadoAquarios
    };
    res.json(resp);

  - Exemplo de melhoria (model): usar bcrypt:

    // no cadastrar: salvar hash em vez de senha
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(senha, 10);
    // INSERT ... VALUES ('${hash}')

    // no autenticar: buscar usuário por email e usar bcrypt.compare(senha, hash)

- src/routes/aquarios.js e src/controllers/aquarioController.js
  - O que faz: buscar aquários por empresa e cadastrar aquário.
  - Problema encontrado: rota define `/:empresaId` mas o controller lê `req.params.idUsuario`. Isso gera undefined.
  - Correção simples: no controller, trocar `var idUsuario = req.params.idUsuario;` por `var empresaId = req.params.empresaId;` e usar `empresaId` ao chamar o model.
  - Arquivo/linha: src/controllers/aquarioController.js — início da função buscarAquariosPorEmpresa.

- src/models/*Model.js (todos os models)
  - O que fazem: executam SQL diretamente via string concatenada.
  - Risco: SQL injection.
  - O que mudar: usar queries parametrizadas. Exemplo com mysql2:

    // em vez de:
    var instrucaoSql = `SELECT * FROM aquario WHERE fk_empresa = ${empresaId}`;

    // usar:
    var instrucaoSql = 'SELECT * FROM aquario WHERE fk_empresa = ?';
    database.executar(instrucaoSql, [empresaId]);

  - Observação: atualmente database.executar aceita apenas o SQL (uma string). Para parametrizar, adapte database/config.js para aceitar parâmetros e usar conexao.execute(instrucao, params).

- src/models/avisoModel.js e src/controllers/avisoController.js
  - O que faz: manipula avisos (comentários) — listar, pesquisar, publicar, editar, deletar.
  - Pontos a revisar:
    - A query de listar e pesquisar inclui `u.senha` no SELECT. Remova `u.senha` para não expor senhas.
    - pesquisarDescricao utiliza `WHERE a.descricao LIKE '${texto}'`. Decida onde inserir curingas `%`. Melhor: no controller criar `texto = `%${texto}%` e utilizar parâmetro.
    - Para dashboard unificado: se quiser filtrar por local, verifique se existe vínculo entre aviso e local (fk_local, fk_empresa, etc.). Caso não exista, será preciso adicionar esse vínculo no banco ou mapear comentários por empresa/aqaurio conforme necessário.

- public/login.html e public/cadastro.html
  - O que fazem: enviam fetch para /usuarios/autenticar e /usuarios/cadastrar com chaves emailServer, senhaServer, etc.
  - Pontos: confirme que os nomes de campo no front batem com os esperados pelo backend (emailServer, senhaServer, idEmpresaVincularServer).

- public/dashboard/*.html (ou site/*.html)
  - O que fazem: exibem mural, gráficos e usam fetch para avisos e medidas.
  - Para unificar a dashboard em uma tela: escolha a tela base (ex.: public/dashboard/dashboard.html) e adicionar um <select> com onchange que chama fetch(`/avisos/por_local/${localId}`) ou filtra resultados já baixados.

5. Implementando proteção contra SQL injection (passos concretos)
1. Alterar src/database/config.js para exportar uma função executar(instrucao, params) que use conexao.execute(instrucao, params) (mysql2). Exemplo mínimo:

    function executar(instrucao, params = []) {
      return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.execute(instrucao, params, function (erro, resultados) {
          conexao.end();
          if (erro) reject(erro);
          resolve(resultados);
        });
      });
    }

2. Atualizar models para usar placeholders `?` e passar array de params.

6. Passo a passo prático (ordem de execução)
1. Criar .env com as variáveis descritas.
2. npm install && npm start — corrigir erros de conexão.
3. Testar POST /usuarios/autenticar com curl/Postman.
4. Corrigir o bug de parametro em aquarioController (empresaId) e reiniciar.
5. Remover `senha` de respostas (usuarioController e avisoModel SELECTs).
6. Se tudo funcionar, decidir se vai implementar hashing de senha e parametrização de queries (recomendado). Se sim, implemente database.executar parametrizado e atualize models.
7. Para a dashboard unificada: identificar se avisos já têm vínculo com locais. Se sim, criar endpoint GET /avisos/por_local/:localId; caso não, planejar adicionar coluna fk_local ou usar empresaId/aquarioId como filtro.

7. Exemplos de requests/responses (simples)
- POST /usuarios/autenticar
  Request body: { "emailServer": "a@a.com", "senhaServer": "123" }
  Success (200):
    { "id": 1, "email": "a@a.com", "nome": "Gustavo", "aquarios": [ /* ... */ ] }
  Error (403): Email e/ou senha inválido(s)

- GET /avisos/listar
  Success (200): [ { idAviso, titulo, descricao, fk_usuario, idUsuario, nome, email }, ... ]

8. Notas finais e recomendações
- Priorize: (1) configuração de .env e conexão; (2) correção de parâmetro aquarios; (3) remoção de senhas nas respostas; (4) parametrização de queries; (5) hashing de senhas.
- Não faça alterações de banco sem confirmar (eu posso ajudar a gerar scripts ALTER TABLE se necessário).
- Se quiser, eu aplico automaticamente as correções não invasivas (corrigir parametro aquarios e remover senha das respostas). Autorizo executar essas duas mudanças agora se você confirmar.

Se quiser que eu implemente alguma das mudanças listadas (ex.: correção do controller, remoção de campo senha nas respostas, ou conversão para queries parametrizadas), me diga qual e eu faço as alterações no código e testo localmente com comandos.
