const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");




const validarJWT = async( req = request, res = response , next ) => {

    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        }); 
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.PRIVATEKEY);

        const usuario = await Usuario.findById( uid );
        
        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }


        if( !usuario.status ){
            return res.status(401).json({
                msg: 'Token no valido - usuario desactivado'
            })
        }


        req.usuario = usuario; 
        next();


    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}



module.exports = {
    validarJWT
}