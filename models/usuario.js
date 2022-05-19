// Ejemplo del objeto Usuario
// {
//     nombre: 'Sergio',
//     correo: 'test',
//     password: '123456',
//     img: '12345',
//     rol: '12345'
//     estado: false,
//     google: false,
// }

const { Schema, model  } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatrio']
    },
    email: {
        type    : String,
        required: [true, 'El email es requerido'],
        unique  : true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatrio']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true],
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Para evitar mostrar el password y el __v
// Esto siempre tiene que ser una finción normal, no puede ser de flecha
UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model( 'Usuario', UsuarioSchema );