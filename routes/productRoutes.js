const express = require('express');
const router = express.Router();

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

router.get('/', allProducts);
router.get('/buscar', searchProduct);
router.get('/categoria/:nombre', productsByCategories);
router.get('/precio/:min-:max', productsByPrice);
router.get('/:codigo', productByCode);
router.post('/', createProduct);
router.post('/masivo', massiveProductsLoad);
router.put('/:codigo', updateProduct);
router.delete('/:codigo', deleteProduct);


module.exports = router;