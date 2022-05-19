const { Router } = require('express');
const { check }  = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRol, tieneRol } = require('../middlewares/validar-roles');

// Esta importación sustituye a las lineas comentadas arriba - se necesita crear el index dentro de los middlewares
const {
    validarCampos,
    validarJWT,
    esAdminRol,
    tieneRol
}= require('../middlewares')

const { esRolValido, emailExiste, usuarioExiste } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosDelete, 
        usuariosPut, 
        usuariosPatch, 
        usuariosPost} = require('../controllers/usuarios');


const router = Router();

    router.get('/', usuariosGet );

    router.post('/',[
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El formato del email no es el correcto').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({min: 6}),
        // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom( esRolValido ),
        check('email').custom(emailExiste),
        validarCampos
    ], usuariosPost);
    
    router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check ('id').custom( usuarioExiste ),
        check('role').custom( esRolValido ),
        validarCampos
    ] , usuariosPut );

    router.patch('/', usuariosPatch );


    router.delete('/:id', [
        validarJWT,
        // esAdminRol,
        tieneRol('ADMIN_ROLE', 'USER_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check ('id').custom( usuarioExiste ),
        validarCampos
    ] , usuariosDelete );




module.exports = router;