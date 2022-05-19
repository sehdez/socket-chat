const { Router } = require("express");
const { check } = require("express-validator");
const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoriaPorId, 
    actualizarCategoria, 
    eliminarCategoria } = require("../controllers/categorias");

const { categoriaExiste } = require("../helpers/db-validators");

const { validarCampos, validarJWT, esAdminRol } = require("../middlewares");


const router = Router();

// Mostrar todas las categorias - publico
router.get('/', obtenerCategorias);

// Mostrar una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
], obtenerCategoriaPorId );

// Crear categoria - privado - cualquier usuario
router.post('/', [
    validarJWT,
    check('name', 'El nombre es requerido').not().isEmpty(),
    validarCampos
] , crearCategoria);

// modificar categoria - privado - cualquier usuario
router.put('/:id', [
    validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check ('id').custom( categoriaExiste ),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
], actualizarCategoria );

// Crear categoria - privado - Admin
router.delete('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check ('id').custom( categoriaExiste ),
    esAdminRol,
    validarCampos
], eliminarCategoria);


module.exports = router;