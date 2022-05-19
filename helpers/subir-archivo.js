const { request, response } = require('express');

const path = require('path');
const { v4: uuid } = require('uuid')


const subirArchivo = ( files, extensionesPermitidas = ['jpg','png','jpeg','gif'], carpeta = ''  ) => {
    
    return new Promise ( (resolve, reject) => {

        const { archivo } = files; 
        const nombreCorto = archivo.name.split('.');
        const extension = nombreCorto[nombreCorto.length -1];
        
        // Validar las extenciones 
        if ( !extensionesPermitidas.includes( extension ) ){
            return reject({msg:`${ extension } no es una extensión valida, prueba con: ${ extensionesPermitidas }`});
        }

        const nameTemp = uuid() + '.' + extension;

        
        uploadPath = path.join(__dirname,'../uploads/', carpeta, nameTemp );
        
        archivo.mv(uploadPath, function(err) {
            if (err) {
            return reject(err);
            }
        
            resolve(nameTemp);
        });


    } )


    

}

module.exports = {
    subirArchivo
}