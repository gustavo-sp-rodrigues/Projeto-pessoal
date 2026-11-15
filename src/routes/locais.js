var express = require("express");
var router = express.Router();

var locaisController = require("SELECT * from locais");

// endpoints kept equal to aquarios routes but mounted under /locais for the Vôlei SP site
router.get("/:empresaId", function (req, res) {
  locaisController.buscarAquariosPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  locaisController.cadastrar(req, res);
})

module.exports = router;
