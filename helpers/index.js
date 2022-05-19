const dbValidators = requie('./db-Validator');
const generarJWT = require('./generar-jwt');
const gogleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');



module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...gogleVerify,
    ...subirArchivo
}
