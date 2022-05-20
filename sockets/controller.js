const { comprobarJWT } = require('../helpers')
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();

const socketController = async( socket, io ) => {
    const token   = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);
    
    if ( !usuario ){
        return socket.disconnect();
    }
    // Agregar Usuario conectado 
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    io.emit('recibir-mensajes', chatMensajes.ultimos10);
    // Conectar a sala especial
    socket.join( usuario.id )// global, socket.id, usuario.id


    // Limpiar cuando el usuario se desconecta
    socket.on('disconnect', ()=> {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    // Enviar Mensaje
    socket.on('enviar-mensaje', ( { uid, mensaje} )=> {
        if( uid ){ 
            socket.to( uid ).emit('mensajes-privados', {de: usuario.name, mensaje })
        }else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.name, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
            
    })


}

module.exports = {
    socketController
}