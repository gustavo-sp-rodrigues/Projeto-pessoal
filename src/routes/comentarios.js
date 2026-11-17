var express = require("express");
var router = express.Router();

var comentarioController = require("../controllers/comentarioController");

// ============================================================================
// ROUTES: definem os endereços (URLs) da API e qual função do Controller responde.
// Este arquivo é ligado ao Express em src/routes/index.js (prefixo "/comentarios").
//
// Exemplo: GET /comentarios/por_local/2
//   -> entra aqui na rota "/por_local/:id_local"
//   -> chama comentarioController.listar_por_local(req, res)
// ============================================================================

// GET /comentarios/listar -> lista todos os comentários.
router.get("/listar", function (req, res) {
    comentarioController.listar(req, res);
})

// GET /comentarios/por_local/:id_local -> lista os comentários de um local.
// O trecho ":id_local" é um parâmetro variável que chega em req.params.
router.get("/por_local/:id_local", function (req, res) {
    comentarioController.listar_por_local(req, res);
});

// POST /comentarios/cadastrar -> cadastra um novo comentário com as três notas.
router.post("/cadastrar", function (req, res) {
    comentarioController.cadastrar(req, res);
});


module.exports = router;
