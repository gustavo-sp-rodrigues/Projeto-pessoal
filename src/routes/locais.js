var express = require("express");
var router = express.Router();

var aquarioController = require("../controllers/aquarioController");

// endpoints kept equal to aquarios routes but mounted under /locais for the Vôlei SP site
router.get("/:empresaId", function (req, res) {
  aquarioController.buscarAquariosPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  aquarioController.cadastrar(req, res);
})

module.exports = router;
