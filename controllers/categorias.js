const { response, request } = require("express");
const { Categoria, Producto } = require("../models");


// Obtener Categorias
const obtenerCategorias = async( req = request, res = response ) => {
    try {
        const { desde = 0, limite = 10 } = req.query
        
        const [ totalCategorias, categorias ] = await Promise.all([
            Categoria.countDocuments({ status:true }),
            Categoria.find({ status:true })
                .skip( Number( desde ) )
                .limit( Number( limite ))
                .populate('user', 'name')
        ])

        
        res.json({totalCategorias, categorias});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}


// Obtener Categoria por id
const obtenerCategoriaPorId = async( req = request, res = response ) => {
    const { id } = req.params;
    const  categoria = await Categoria.findById( id ).populate('user', 'name');
    const productos = await Producto.find({ category: id });
    if (  !categoria || !categoria.status ){
        return res.status(400).json({
            msg: 'La categoría no existe'
        })
    }

    res.json({ categoria, productos })
}



// Crear categoria
const crearCategoria = async( req = request, res = response ) => {

    try {
        const name = req.body.name.toUpperCase();

        const categoriaDB = await Categoria.findOne( {name} );

        if ( categoriaDB ){
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.name } ya existe`
            })
        }
        const data = {
            name,
            user: req.usuario._id
        }
        const categoria = new Categoria( data );
        await categoria.save();
        res.json(categoria)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

// Actualizar Categoria
const actualizarCategoria = async( req = request, res = response ) => {

    try {
        const { id }   = req.params;
        const  name  = req.body.name.toUpperCase();
        const data = {
            name,
            user: req.usuario._id
        }

    
        const categoriaDB = await Categoria.findByIdAndUpdate(id, data, {new:true}).populate('user', 'name');

        res.json(categoriaDB);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }
}

// Eliminar Categoria
const eliminarCategoria = async( req = request, res = response ) => {

    try {
        const { id }   = req.params;
    
        const categoriaDB = await Categoria.findByIdAndUpdate( id, { status:false }, {new:true} );

        res.json(categoriaDB);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
}