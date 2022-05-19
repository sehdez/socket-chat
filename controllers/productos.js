const { request, response } = require("express");
const { Producto } = require("../models");


const crearProducto = async( req = request, res = response ) => {

    const { price, description, available = true } = req.body
    const user = req.usuario

    const name = req.body.name.toUpperCase();
    const category = req.body.category.toUpperCase();

    const existeProducto = await Producto.findOne({name});

    if ( existeProducto ){
        return res.status(400).json({
            msg: `El producto ${ name } ya existe`
        })
    } 
    
    const data = {
        name,
        user: user.id,
        price,
        category,
        description,
        available
    }
    const producto = new Producto(data);
    await producto.save();

    res.json(producto);
}


// Obtener todos los productos
const obtenerProductos = async( req = request, res = response ) => {

    const { desde = 0, limite = 100 } = req.query;

    const [ totalproductos, productos ] = await Promise.all([
        Producto.count( { status:true } ),
        Producto.find( {status:true} )
                .populate('user', 'name')
                .populate('category', 'name')
                .skip( desde )
                .limit(limite)
    ]);              
    res.json({
        totalproductos,
        productos
    })
}

// Obtener producto por id
const obtenerProductoPorId = async( req = request, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                .populate('user', 'name')
                .populate('category', 'name')

    res.json(producto);
}

const editarProducto = async( req = request, res = response ) => {

    const { category, price = 0, description = '', available = true } = req.body;
    const name = req.body.name.toUpperCase();
    const { id } = req.params;
    const user = req.usuario.id;

    try {
        const data = {
            name,
            user,
            price,
            category,
            description,
            available
        }
        const producto = await Producto.findByIdAndUpdate(id, data, {new:true})
                            .populate('user','name')
                            .populate('category','name');

        res.json(producto)
    } catch (error) {
        console.log(error)
         res.status(500).json({
             msg: 'Hable con el administrador de la BD'
         });
    }
}

const eliminarProducto = async( req = request, res = response ) => {

    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndUpdate( id, { status:false }, {new:true} )

    res.json(productoEliminado)
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    editarProducto,
    eliminarProducto

}