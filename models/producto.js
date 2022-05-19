const { type } = require('express/lib/response');
const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    name:{
        type: String,
        required: [true, 'El producto es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    description:{ type: String },
    available:{ type: Boolean, default:true },
    img:{ type: String }
});



ProductoSchema.methods.toJSON = function(){
    const { __v, status, ...producto} = this.toObject();
    return producto;
}





module.exports = model('Producto', ProductoSchema);