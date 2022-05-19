const { request, response } = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async( search, res = response ) => {
    const esMongoId = ObjectId.isValid(search);

    if( esMongoId ){
        const usuario = await Usuario.findById( search );
        return res.json({
            results: ( usuario )
                    ? usuario
                    : []
        });
    }
    const regexp = RegExp( search, 'i' )
    const usuarios = await Usuario.find({
        $or : [{name: regexp}, {email: regexp}] ,
        $and: [{ status:true }]
    });
    res.json({
        results: usuarios
    })
}



const buscarCategorias = async( search, res = response ) => {
    const esMongoId = ObjectId.isValid(search);

    if( esMongoId ){
        const categoria = await Categoria.findById( search );
        return res.json({
            results: ( categoria )
                    ? categoria
                    : []
        });
    }
    const regexp = RegExp( search, 'i' )
    const categorias = await Categoria.find({name: regexp, status: true})
                                      .populate('user', 'name');
    res.json({
        results: categorias
    })
}


const buscarProductos = async( search, res = response ) => {
    const esMongoId = ObjectId.isValid(search);

    if( esMongoId ){
        const producto = await Producto.findById( search );
        return res.json({
            results: ( producto )
                    ? producto
                    : []
        });
    }
    const regexp = RegExp( search, 'i' )
    const productos = await Producto.find({'name': regexp, 'status': true}).populate('user', 'name').populate('category','name');
    res.json({
        results: productos
    })
}




const buscar = ( req= request, res = response ) => {
    const { collection, search } = req.params;

    if ( !coleccionesPermitidas.includes( collection ) ){
        res.status(400).json({
            msg:`No se encuentra la coleccion ${ collection }, prueba con alguna de estas ${ coleccionesPermitidas }`
        })
    }

    switch (collection) {
        
        case 'categorias':
            buscarCategorias( search, res )
            break;

        case 'productos':
            buscarProductos( search, res );
            break;

        case 'roles':
            break;

        case 'usuarios':
            buscarUsuarios( search, res );
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido esta opción' 
            })




    }


}




module.exports = {
    buscar
}
