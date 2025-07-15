//conexion a mongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const { DB_PROTOCOL, DB_USER, DB_PASSWORD, DB_HOST, DB_OPTIONS, DB_NAME } = process.env;
const MONGODB_URI = `${DB_PROTOCOL}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`;

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