const bcryptjs = require("bcryptjs");
const { response, request } = require("express");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");



const login = async(req = request, res = response) => {
    try {
        const { email, password } = req.body;

        // Verificar si el Usuario existe
        const usuario = await Usuario.findOne( { email } );
        if ( !usuario ){
            return res.status(400).json({
                msg: 'El correo no se encuentra registrado en la base de datos'
            })
        }

        // Verificar si el usuario está activo 
        if (!usuario.status){
            return res.status(400).json({
                msg: 'El usuario no está activo'
            });
        }


        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id);


        res.json({
            usuario,
            token
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte al administrador de la base de datos'
        })
    }
}


const googleSignIn = async( req = request, res = response ) => {
    try {
    const { id_token } = req.body;
    const { name, email, img }  = await googleVerify( id_token );

    let usuario = await Usuario.findOne({email});

    if ( !usuario ){
        // Crear Usuario
        const data = {
            name,
            email,
            password: ':)',
            img,
            google: true
        }
            
            usuario = new Usuario( data );
            await usuario.save();
    }

    // Si el usuario esta en BD pero lo borraron
    if ( !usuario.status ) {
        return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        })
    }

    // Generar JWT
    const token = await generarJWT( usuario.id );


    res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'El token no se pudo verificar'
        })
    }
}

const renovarJWT = async ( req = request, res = response ) =>{


    const { usuario } = req

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({ 
        usuario,
        token 
    })
}



module.exports = {
    login,
    googleSignIn,
    renovarJWT
}