var comentarioModel = require("../models/comentarioModel");

function listar(req, res) {
    comentarioModel.listar().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os comentários: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

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

function cadastrar(req, res) {
    var nota = req.body.nota;
    var comentario = req.body.comentario;
    var fk_local = req.body.fk_local;
    var fk_usuario = req.body.fk_usuario;

    if (nota == undefined) {
        res.status(400).send("A nota está undefined!");
    } else if (comentario == undefined) {
        res.status(400).send("O comentário está undefined!");
    } else if (fk_local == undefined) {
        res.status(400).send("O local está undefined!");
    } else if (fk_usuario == undefined) {
        res.status(400).send("O usuário está undefined!");
    } else {
        comentarioModel.cadastrar(nota, comentario, fk_local, fk_usuario)
            .then(function (resultado) {
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