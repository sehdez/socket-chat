const url = ( window.location.hostname.includes('localhost') )
                ? 'http://localhost:3000/api/auth/'
                : 'https://rest-server-by-sergio.herokuapp.com/api/auth/'


// Referencias HTML 
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

let usuario = null;
let socket  = null;

// Validar token del localStorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';
    try{

        
        if( token <= 10 ){
            window.location = 'index.html'
            return false;
        }
        const resp = await fetch(url,{
            headers:{'x-token': token}
        });
        const { usuario: usuarioDB, token: tokenDB } = await resp.json();
        usuario = usuarioDB;
        localStorage.setItem('token', tokenDB);
        document.title = usuario.name;
        
        await conectarSocket();
    }catch( err ){
        console.log(err)
        window.location = 'index.html'
    }

}

const conectarSocket = async () =>{
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('recibir-mensajes', dibujarMensajes )

    socket.on('usuarios-activos', ( usuarios )=> {
        //TODO: 
        dibujarUsuarios(usuarios);

    })

    socket.on('mensajes-privados', ( payload )=> {
       console.log('privado', payload)
    })
}

const dibujarMensajes = ( mensajes = [] )=> {
    let mensajesHtml = '';
    mensajes.forEach( ({ name, mensaje }) => {
       mensajesHtml += `
           <li>
               <p>
                    <span class="text-primary" > ${ name } - </span> <span> ${ mensaje } </span>
               </p>
           </li>
        
        `;
        
    });
   ulMensajes.innerHTML = mensajesHtml

}



const dibujarUsuarios = ( usuarios = [] )=> {
     let usersHtml = '';
     usuarios.forEach( ({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text.succes" > ${ name }</h5>
                    <span class= "fs-6 text-muted" > ${ uid } </span>
                </p>
            </li>
         
         `;
         
     });
    ulUsuarios.innerHTML = usersHtml

}

txtMensaje.addEventListener('keyup', ({ key })=>{
    const mensaje = txtMensaje.value;
    const { name } = usuario;
    const uid = txtUid.value;
    if(key !== 'Enter' || mensaje.trim().length ===0 ){
        return;
    }
    socket.emit('enviar-mensaje', { mensaje, uid, name})
    txtMensaje.value=''
})



const main = async () => {
    // Validar JWK
    await validarJWT();
}

main();

