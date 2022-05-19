const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();


router.post('/', cargarArchivo );

router.put('/:collection/:id', [
    check('id','El id no es valido').isMongoId(),
    check('collection').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagen)




module.exports = router;