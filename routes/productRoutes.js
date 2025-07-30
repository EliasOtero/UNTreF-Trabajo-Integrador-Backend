const express = require('express');
const router = express.Router();

//Importar los controladores que manejan la logica de cada endpoint
const
{
    allProducts,
    productByCode,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    productsByCategories,
    productsByPrice,
    massiveProductsLoad


} = require('../controllers/productController');

//Rutas CRUD basicas y adicionales
router.get('/', allProducts); //Obtener todos los productos
router.get('/buscar', searchProduct); //Buscar productos por termino en nombre
router.get('/categoria/:nombre', productsByCategories); //Filtrar productos por categorias
router.get('/precio/:min-:max', productsByPrice); //Filtrar productos por rango de precio
router.get('/:codigo', productByCode); //Obtener productos por codigo
router.post('/', createProduct); //Crear un nuevo producto
router.post('/masivo', massiveProductsLoad); //Carga masiva de productos
router.put('/:codigo', updateProduct); // Actualizar un producto existente
router.delete('/:codigo', deleteProduct); //Eliminar un producto


module.exports = router;