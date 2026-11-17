var database = require("../database/config");

// ============================================================================
// MODEL: é a camada que conversa diretamente com o MySQL.
// Aqui ficam apenas as instruções SQL. Quem chama estas funções é o Controller.
// ============================================================================

// Busca TODOS os comentários do banco, juntando o nome do local e o nome do usuário.
// O JOIN serve para "ligar" a tabela comentario com locais e usuario através das
// chaves estrangeiras (fk_local e fk_usuario).
function listar() {
    var instrucaoSql = `
        SELECT c.id,
               c.nota_localizacao, c.nota_estrutura, c.nota_ambiente,
               c.comentario, c.fk_local, c.fk_usuario,
               l.nome AS nome_local, u.nome AS nome_usuario
        FROM comentario c
        JOIN locais l  ON l.id = c.fk_local
        JOIN usuario u ON u.id = c.fk_usuario;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Busca apenas os comentários de UM local (recebido pelo parâmetro id_local).
// É esta função que alimenta a dashboard: com a lista retornada, o dashboard.js
// calcula as médias de localização, estrutura e ambiente e monta o gráfico.
function listar_por_local(id_local) {
    var instrucaoSql = `
        SELECT c.id,
               c.nota_localizacao, c.nota_estrutura, c.nota_ambiente,
               c.comentario, c.fk_usuario,
               u.nome AS nome_usuario
        FROM comentario c
        JOIN usuario u ON u.id = c.fk_usuario
        WHERE c.fk_local = ${id_local};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Insere uma nova avaliação de um usuário para um local.
// Cada comentário guarda três notas separadas: localização, estrutura e ambiente.
function cadastrar(nota_localizacao, nota_estrutura, nota_ambiente, comentario, fk_local, fk_usuario) {
    var instrucaoSql = `
        INSERT INTO comentario
            (nota_localizacao, nota_estrutura, nota_ambiente, comentario, fk_local, fk_usuario)
        VALUES
            ('${nota_localizacao}', '${nota_estrutura}', '${nota_ambiente}', '${comentario}', ${fk_local}, ${fk_usuario});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    listar_por_local,
    cadastrar
};
