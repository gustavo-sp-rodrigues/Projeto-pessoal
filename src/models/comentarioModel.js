var database = require("../database/config");



// Busca TODOS os comentários do banco, juntando o nome do local e o nome do usuário.

function listar() {
    var instrucaoSql = `
        SELECT * from vw_comentarios;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Busca apenas os comentários de UM local (recebido pelo parâmetro id_local).

function listar_por_local(id_local) {
    var instrucaoSql = `
        SELECT * from vw_comentario_local
        WHERE c.fk_local = ${id_local};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Insere uma nova avaliação de um usuário para um local.

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
