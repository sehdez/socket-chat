const { Schema, model } = require('mongoose');

const CategoriaSchema = new Schema({
    name:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
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
    }
});



CategoriaSchema.methods.toJSON = function(){
    const { __v, status, ...categoria} = this.toObject();
    return categoria;
}





module.exports = model('Categoria', CategoriaSchema);