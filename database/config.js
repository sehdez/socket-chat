const mongoose = require('mongoose');


const dbConection = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_DB, {
                // useNewUrlParser     : true,
                useUnifiedTopology  : true,
                // useCreateIndex      : true,
                // useFindAndModify    : false
        });
        console.log('Base de datos online');





    } catch (error) {
        console.log(error)
        throw new Error('Error al establecer conexión con la BD');
    }

}


module.exports = {
    dbConection
}