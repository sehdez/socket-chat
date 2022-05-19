const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');


const esRolValido =  async(role = '') =>{
    const existeRol = await Role .findOne({ role });
    if (!existeRol){
        throw new Error(`El rol ${ role } no está registrado en la base de datos.`); 
    }
}

// Validar si el email existe o no
const emailExiste = async(email) => {
    
    const existeEmail = await Usuario.findOne( {email} );
    if ( existeEmail ){
        throw new Error (`El correo ${ email } ya existe`);
    }
}

// Validar si el usuario existe o no
const usuarioExiste = async( id ) => {
    
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ){
        throw new Error (`No existe ningun usuario con el id ${ id }`);
    }
}

// Validar si el usuario existe o no
const categoriaExiste = async( id ) => {
    
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria || !existeCategoria.status ){
        throw new Error (`No existe ninguna categoria con el id ${ id }`);
    }
}

const productoExiste = async( id ) => {
    
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto || !existeProducto.status ){
        throw new Error (`No existe ningún producto con el id ${ id }`);
    }
}

const coleccionesPermitidas = async( coleccion = '', coleccionesValidas = [] ) => {

    const valida = coleccionesValidas.includes( coleccion );

    if( !valida ){
        throw new Error (`La colección ${ coleccion } no es valida, intenta con ${ coleccionesValidas }`);
    }
    return true;
}






module.exports = {
    coleccionesPermitidas,
    esRolValido,
    emailExiste,
    usuarioExiste,
    categoriaExiste,
    productoExiste
}