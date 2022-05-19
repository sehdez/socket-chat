const { Router } = require("express");
const { check } = require("express-validator");

const { crearProducto,
        obtenerProductos, 
        obtenerProductoPorId, 
        editarProducto, 
        eliminarProducto } = require("../controllers/productos");

const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");

const { categoriaExiste, productoExiste } = require("../helpers/db-validators");


const router = Router();

// Mostrar todos los productos - publico
router.get('/', obtenerProductos);

// Mostrar un producto por id - publico
router.get('/:id', [
    check('id', 'EL id es obligatorio').not().isEmpty(),
    check('id', 'El id no es válido').isMongoId(),
    validarCampos,
    check('id').custom(productoExiste),
    validarCampos
], obtenerProductoPorId);

// Crear producto - usuario 
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('category', 'No es una categoria válida').isMongoId(),
    check('category').custom( categoriaExiste ),
    validarCampos
], crearProducto);


// Editar producto - usuario
router.put('/:id',[
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(productoExiste),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatorio').not().isEmpty(),
    check('category', 'No es una categoria válida').isMongoId(),
    check('category').custom( categoriaExiste ),
    validarCampos
], editarProducto);



// Eliminar producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'El id no es válido').isMongoId(),
    validarCampos,
    check('id').custom(productoExiste),
    validarCampos
], eliminarProducto);



module.exports = router