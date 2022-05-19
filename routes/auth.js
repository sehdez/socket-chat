const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");


const { login, googleSignIn, renovarJWT } = require("../controllers/auth");
const { emailExiste } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares");

const router = Router();


router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no tiene un formato válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener al menos 6 caracteres').isLength({ min: 6 }),
    check('email').not().custom(emailExiste),
    validarCampos,
], login );


router.get('/', [
    validarJWT,
    validarCampos,
], renovarJWT );




router.post('/google', [
    check('id_token', 'El token es obligatorio').not().isEmpty(),
    validarCampos,
], googleSignIn );


module.exports = router;