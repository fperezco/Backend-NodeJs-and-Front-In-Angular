//puerto
process.env.PORT = process.env.PORT || 3000;


//ENTORNO
//VARIABLE establecida por heroku
//si no existe => estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos 
let urlDB;

if (process.env.NODE_ENV == 'dev')
    urlDB = 'mongodb://localhost:27017/hospitalDB';
else {
    //urlDB = 'mongodb+srv://pacouser:pacouser@cluster0-prrvi.mongodb.net/test?retryWrites=true&w=majority';
    //establezco variable de entorno con heroku para k no se va el pass en plano en git
    //heroku config:set MONGO_URI="mongodb+srv://pacouser:pacouser@cluster0-prrvi.mongodb.net/test?retryWrites=true&w=majority"
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

