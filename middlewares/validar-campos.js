const { response, request } = require("express")
const { validationResult } = require("express-validator")



const validarCampos = async( req = request, res = response, next ) => {

    try {
        const errors = validationResult( req );
        if (!errors.isEmpty()){
            return res.status(400).json(errors);
        }
        next();
        
    } catch (error) {
        console.log(error)
        return res.status().json({
            errors: 'Pongase en contacto con el Administrador'
        });
        
    }
}

module.exports = {
    validarCampos
}