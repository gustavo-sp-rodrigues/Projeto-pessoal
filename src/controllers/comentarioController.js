var comentarioModel = require("../models/comentarioModel");

// ============================================================================
// CONTROLLER: recebe a requisição (req), chama o Model e devolve a resposta (res).
// Ele NÃO escreve SQL: apenas organiza os dados e escolhe qual status HTTP enviar.
//
// Fluxo de uma requisição da dashboard:
//   1. dashboard.js faz fetch("/comentarios/...")
//   2. routes/comentarios.js direciona para uma função daqui
//   3. esta função chama o Model (que executa o SQL)
//   4. o resultado volta em JSON para o dashboard.js
// ============================================================================

// GET /comentarios/listar -> devolve todos os comentários cadastrados.
function listar(req, res) {
    comentarioModel.listar().then(function (resultado) {
        // 200 = deu tudo certo; o resultado (array de linhas) vira JSON.
        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os comentários: ", erro.sqlMessage);
        // 500 = erro interno (por exemplo, banco fora do ar ou SQL inválido).
        res.status(500).json(erro.sqlMessage);
    });
}

// GET /comentarios/por_local/:id_local -> devolve os comentários de um local.
// O ":id_local" da rota chega em req.params.id_local.
function listar_por_local(req, res) {
    var id_local = req.params.id_local;

    comentarioModel.listar_por_local(id_local).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os comentários: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

// POST /comentarios/cadastrar -> recebe os dados do formulário e grava no banco.
// req.body contém o JSON enviado pelo dashboard.js.
function cadastrar(req, res) {
    // Lê cada campo enviado no corpo da requisição.
    var nota_localizacao = req.body.nota_localizacao;
    var nota_estrutura = req.body.nota_estrutura;
    var nota_ambiente = req.body.nota_ambiente;
    var comentario = req.body.comentario;
    var fk_local = req.body.fk_local;
    var fk_usuario = req.body.fk_usuario;

    // Validação: se algum campo obrigatório não chegou, respondemos 400 (erro do cliente).
    if (nota_localizacao == undefined) {
        res.status(400).send("A nota de localização está undefined!");
    } else if (nota_estrutura == undefined) {
        res.status(400).send("A nota de estrutura está undefined!");
    } else if (nota_ambiente == undefined) {
        res.status(400).send("A nota de ambiente está undefined!");
    } else if (comentario == undefined) {
        res.status(400).send("O comentário está undefined!");
    } else if (fk_local == undefined) {
        res.status(400).send("O local está undefined!");
    } else if (fk_usuario == undefined) {
        res.status(400).send("O usuário está undefined!");
    } else {
        // Tudo certo: chama o Model para executar o INSERT.
        comentarioModel.cadastrar(
            nota_localizacao,
            nota_estrutura,
            nota_ambiente,
            comentario,
            fk_local,
            fk_usuario
        ).then(function (resultado) {
            // 201 = criado com sucesso.
            res.status(201).json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao cadastrar o comentário: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

module.exports = {
    listar,
    listar_por_local,
    cadastrar
};
