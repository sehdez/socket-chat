const { response, request } = require("express")


const esAdminRol = ( req = request, res = response, next ) => {

    if ( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere validar el rol sin verificar el token primero'
        });
    }
    const { role, name} = req.usuario;
    if ( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `El usuario ${ name } no puede realizar esta acción `
        })
    }
    next();
}


const tieneRol = ( ...roles ) => {
    return ( req = request, res = response, next ) => {

        if ( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere validar el rol sin verificar el token primero'
            });
        }
        if ( !roles.includes( req.usuario.role ) ){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();


    }

}



module.exports = {
    esAdminRol,
    tieneRol
}