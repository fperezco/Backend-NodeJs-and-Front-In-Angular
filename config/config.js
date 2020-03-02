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

//google client id
module.exports.GOOGLE_CLIENT_ID = '846283999224-qu7ir0svbbrgbt5miouodqcur1dh25mm.apps.googleusercontent.com';
module.exports.GOOGLE_SECRET = '5bitp_AYOLCdd7etmJFVObhf';