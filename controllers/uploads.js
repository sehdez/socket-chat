
const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");



const cargarArchivo = async( req = request, res = response )=> {


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        
        res.status(400).json({msg:'No hay archivos para subir.'});
        return;
    }
    try {
        const nombre = await subirArchivo( req.files);
        res.json({ nombre });
        
    } catch ({ msg }) {
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async ( req = request, res = response ) => {

    const { collection, id } = req.params;

    let modelo;
    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: 'No se encontró ningun usuario para editar' });
            }
            
            break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: 'No se encontró ningun producto para editar' });
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Hace falta programar esga opción xD'});
    }

    const nombre = await subirArchivo( req.files, undefined, collection);
    modelo.img = nombre
    await modelo.save();
    res.json(modelo);

}


module.exports = {
    actualizarImagen,
    cargarArchivo
}