//conexion a mongoDB
const mongoose = require('mongoose');
require('dotenv').config();

//Extraidas variables del entorno para formar la URI
const { DB_PROTOCOL, DB_USER, DB_PASSWORD, DB_HOST, DB_OPTIONS, DB_NAME } = process.env;
//Construir URI completa para la conexion con MongoDB
const MONGODB_URI = `${DB_PROTOCOL}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`;


//Funcion para conectar a la base de datos MongoDB usando mongoose.
//En caso de error, termina el proceso
const connectDB = async () => 
    {
        try
        {
            await mongoose.connect(MONGODB_URI);
            console.log('MongoDB connected successfully');
        }catch (error)
        {
            console.error('Error connecting to MongoDB:', error.message);
            process.exit(1); // Exit the process with failure
        }
    };

module.exports = connectDB;