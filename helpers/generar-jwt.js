const jwt = require('jsonwebtoken');
const {Usuario} = require('../models');

const generarJWT = ( uid = '' ) =>{

    return new Promise( (resolve, reject) => {

        const payload = { uid }
        jwt.sign( payload, process.env.PRIVATEKEY, {
            expiresIn: '24h'
        }, (err, token) =>{
            if ( err ){
                console.log(err);
                reject('No se pudo generar el JWT');
            } else{
                resolve(token);
            }
        });

    })
}

const comprobarJWT = async ( token = '' ) => {
    
    try{
        if(token.length <=10){
            return null;
        }
        const { uid } = jwt.verify(token, process.env.PRIVATEKEY)

        const usuarioDB = await Usuario.findById( uid );
        if(usuarioDB && usuarioDB.status ){

            return usuarioDB
        }else{
            return null
        }

    }catch(err){
        console.log(err)
        return null;

    }

}



module.exports = {
    generarJWT,
    comprobarJWT
}