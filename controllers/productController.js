const { set } = require('mongoose');
const { productDB } = require('../models/product');

//Mostrar todos los productos
const allProducts = async (req, res) => 
    {
        try
        {
            const productos = await productDB.find();
            res.status(200).json(productos)
        } catch(error)
        {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    };

const productByCode = async (req, res) =>
    {
        try 
        {
            const producto = await productDB.findOne({ codigo: parseInt ( req.params.codigo ) });
            if (!producto)
                {
                    return res.status(404).json({ mensaje: 'Producto no encontrado o no existe.' });
                }
                res.status(200).json(producto);
        } catch (error)
        {
            res.status(500).json({ error: 'Error al buscar el producto' });
        }

    };

const createProduct = async (req, res) => 
    {
        try 
        {
            const existe = await productDB.findOne({ codigo: req.body.codigo });
            if (existe) 
                {
                    return res.status(409).json({ mensaje: 'El codigo ya esta en uso' });
                }
            const nuevoProducto = await productDB.create(req.body);
            res.status(201).json(nuevoProducto);
        } catch (error)
        {
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    }

const updateProduct = async (req, res) =>
    {
        try 
        {
            const codigo = req.params.codigo;
            const cambios = req.body;

            const productoActualizado = await productDB.findOneAndUpdate
            (
                { codigo },
                cambios,
                { new: true}
            );
            if (!productoActualizado)
                {
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }
            res.status(200).json(productoActualizado);
        } catch (error)
        {
            res.status(500).json({ error: 'Error al modificar el producto' });
        }
    };

const deleteProduct = async (req, res) =>
    {
        try
        {
            codigo = req.params.codigo;
            const resultado = await productDB.deleteOne({ codigo });

            if (resultado.deletedCount === 0)
                {
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }
            res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
        } catch (error)
        {
            res.status(500).json({ error: 'Error al elimiar el producto' });
        }
    };

const searchProduct = async (req, res) => 
    {
        try 
        {
            const q = req.query.q;
            if (!q)
                {
                    return res.status(400).json({ mensaje: 'Falta el parametro de busqueda' });
                }
            const productos = await productDB.find({ nombre: {$regex: q, $options: 'i'}});
            res.status(200).json({
                mensaje: productos.length === 0 ? 'No se encontraron productos' :undefined,
                resultados: productos
            });
        } catch (error)
        {
            res.status(500).json({ error: 'Error al buscar productos' });
        }
    };

const productsByCategories = async (req, res) => 
    {
        try
        {
            const categoria = req.params.nombre.trim();
            const productos = await productDB.find({
                categoria: { $regex: `^${categoria}$`, $options: 'i'}});
            
            if (productos.length === 0)
                {
                    return res.status(404).json({ mensaje: 'No se encontraron productos para esa categoria' });
                }
            res.status(200).json(productos);
        } catch (error) 
        {
            res.status(500).json({ error: 'Error al filtrar por categoria' })
        }
    };

const productsByPrice = async (req, res) =>
    {
        try
        {
            const { min, max } = req.params;
            const minPrecio = Number(min);
            const maxPrecio = Number(max);
            if (isNaN(minPrecio) || isNaN(maxPrecio)) 
                {
                    return res.status(400).json({ mensaje: 'Parametros de precio invalidos' });
                }
            if (minPrecio > maxPrecio) 
                {
                    return res.status(400).json({ mensaje: 'El precio minimo no puede ser mayor que el maximo' });
                }
            const productos = await productDB.find({
                precio : { $gte: minPrecio, $lte: maxPrecio}});
            if (productos.length === 0)
                {
                    return res.status(404).json({ mensaje: 'No se encontraron productos con ese rango de precio' })
                }
            res.status(200).json(productos);
        } catch (error) 
        {
            res.status(500).json({ error: 'Error al filtrar por rango de precio' });
        }
    }

const massiveProductsLoad = async (req, res) =>
    {
        try 
        {
            const productos = req.body;
            if (!Array.isArray(productos) || productos.length === 0)
                {
                    return res.status(400).json({ mensaje: 'Se debe enviar un arreglo de productos no vacio'});
                }
            const codigos = productos.map(p => p.codigo);
            const codigosUnicos = new Set(codigos);
            if(codigos.length !== codigosUnicos.size)
                {
                    return res.status(400).json({ mensaje: 'Hay codigos repetidos en la lista enviada'});
                }
            const existentes = await productDB.find({ codigo: { $in: codigos } });
            if(existentes.length > 0 )
                {
                    return res.status(409).json({ mensaje: 'Algunos codigos ya existen en la base de datos', codigos: existentes.map(p => p.codigo) });
                }
            const nuevosProductos = await productDB.insertMany(productos);
            res.status(201).json({ mensaje: 'Productos insertados correctamente', nuevosProductos});
        } catch (error)
        {
            res.status(500).json({ error: 'Error en la carga masiva de productos' });
        }
    }


module.exports =
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
}