//puerto
process.env.PORT = process.env.PORT || 3000;


//ENTORNO
//VARIABLE establecida por heroku
//si no existe => estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos 
urlDB = 'mongodb://localhost:27017/hospitalDB';
process.env.URLDB = urlDB;

