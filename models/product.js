const mongoose = require('mongoose')

//Definicion del esquema para un producto
const productSchema = new mongoose.Schema(
    {
        codigo: 
        {
            type: Number,
            required: true,
            unique: true, //Garantiza unicidad en la base de datos
        },
        nombre: 
        {
            type: String,
            required: true
        },
        precio:
        {
            type: Number,
            required: true
        },
        categoria: 
        {
            type: [String], //Array de strings
            required: true 
        }
    });

const productDB = mongoose.model('Products', productSchema);

module.exports = { productDB };