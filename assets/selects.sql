-- --  Autenticar o usuário no login
-- Arquivo: src/models/usuarioModel.js  
-- Busca o usuário com o e-mail e a senha informados.
-- SELECT id, nome, email
-- FROM usuario
-- WHERE email = '${email}'
--   AND senha = '${senha}';


-- --  Listar todos os comentários na página inicial
-- Arquivo: src/models/comentarioModel.js  
-- Busca as avaliações com o nome do local e o nome do usuário que comentou.
-- SELECT
--     c.id,
--     c.nota_localizacao,
--     c.nota_estrutura,
--     c.nota_ambiente,
--     c.comentario,
--     c.fk_local,
--     c.fk_usuario,
--     l.nome AS nome_local,
--     u.nome AS nome_usuario
-- FROM comentario c
-- JOIN locais l ON l.id = c.fk_local
-- JOIN usuario u ON u.id = c.fk_usuario;


-- --  Listar os comentários de um local na dashboard
-- Arquivo: src/models/comentarioModel.js  
-- Busca apenas as avaliações do local selecionado.
-- SELECT
--     c.id,
--     c.nota_localizacao,
--     c.nota_estrutura,
--     c.nota_ambiente,
--     c.comentario,
--     c.fk_usuario,
--     u.nome AS nome_usuario
-- FROM comentario c
-- JOIN usuario u ON u.id = c.fk_usuario
-- WHERE c.fk_local = ${id_local};
-- Essa mesma consulta fornece os dados para os comentários, os indicadores e o gráfico. As médias e a quantidade de avaliações são calculadas no JavaScript, em public/js/dashboard.js.
-- INSERTs


-- -- Cadastrar um usuário

-- Arquivo: src/models/usuarioModel.js  
-- Salva o nome, o e-mail e a senha enviados pelo formulário de cadastro.
-- INSERT INTO usuario (nome, email, senha)
-- VALUES ('${nome}', '${email}', '${senha}');


-- -- Cadastrar um comentário com avaliação
-- Arquivo: src/models/comentarioModel.js  
-- Salva as três notas, o comentário e os identificadores do local e do usuário.
-- INSERT INTO comentario (
--     nota_localizacao,
--     nota_estrutura,
--     nota_ambiente,
--     comentario,
--     fk_local,
--     fk_usuario
-- )
-- VALUES (
--     '${nota_localizacao}',
--     '${nota_estrutura}',
--     '${nota_ambiente}',
--     '${comentario}',
--     ${fk_local},
--     ${fk_usuario}
-- );




-- VIEW: Autenticar usuário
CREATE VIEW vw_login AS
SELECT id, nome, email, senha
FROM usuario;


-- VIEW: Listar todos os comentários na página inicial
CREATE VIEW vw_comentarios AS
SELECT
    c.id,
    c.nota_localizacao,
    c.nota_estrutura,
    c.nota_ambiente,
    c.comentario,
    c.fk_local,
    c.fk_usuario,
    l.nome AS nome_local,
    u.nome AS nome_usuario
FROM comentario c
JOIN locais l ON l.id = c.fk_local
JOIN usuario u ON u.id = c.fk_usuario;

-- VIEW: Listar comentários de um local na dashboard
CREATE VIEW vw_comentarios_local AS
SELECT
    c.id,
    c.nota_localizacao,
    c.nota_estrutura,
    c.nota_ambiente,
    c.comentario,
    c.fk_usuario,
    u.nome AS nome_usuario
FROM comentario c
JOIN usuario u ON u.id = c.fk_usuario;