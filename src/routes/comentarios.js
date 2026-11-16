var express = require("express");
var router = express.Router();

var comentarioController = require("../controllers/comentarioController");


//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get("/listar", function (req, res) {
    comentarioController.listar(req, res);
})

router.get("/por_local/:id_local", function (req, res) {
    comentarioController.listar_por_local(req, res);
});

router.post("/cadastrar", function (req, res) {
  comentarioController.cadastrar(req, res);
});


module.exports = router;