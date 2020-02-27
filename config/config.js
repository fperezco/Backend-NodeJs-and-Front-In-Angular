//puerto
process.env.PORT = process.env.PORT || 3000;


//ENTORNO
//VARIABLE establecida por heroku
//si no existe => estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos 
urlDB = 'mongodb://localhost:27017/hospitalDB';
process.env.URLDB = urlDB;

//VARIABLES DE VENCIMINENTO DEL TOKEN Y SEED O SEMILLA DE AUTH

//60 segs x 60 mins
process.env.JWT_CADUCIDAD_TOKEN = 60 * 60 * 60 * 24;
process.env.JWT_SEED = process.env.JWT_SEED || 'este-es-el-seed-de-desarrollo';
