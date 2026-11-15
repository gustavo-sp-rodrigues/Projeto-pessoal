var database = require("../database/config");

function listar() {
    var instrucaoSql = `
        SELECT c.id, c.nota, c.comentario, c.fk_local, c.fk_usuario,
               l.nome AS nome_local, u.nome AS nome_usuario
        FROM comentario c
        JOIN locais l  ON l.id = c.fk_local
        JOIN usuario u ON u.id = c.fk_usuario;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar_por_local(id_local) {
    var instrucaoSql = `
        SELECT c.id, c.nota, c.comentario, c.fk_usuario, u.nome AS nome_usuario
        FROM comentario c
        JOIN usuario u ON u.id = c.fk_usuario
        WHERE c.fk_local = ${id_local};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nota, comentario, fk_local, fk_usuario) {
    var instrucaoSql = `
        INSERT INTO comentario (nota, comentario, fk_local, fk_usuario)
        VALUES ('${nota}', '${comentario}', ${fk_local}, ${fk_usuario});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    listar_por_local,
    cadastrar
};