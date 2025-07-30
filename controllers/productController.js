const { productDB } = require('../models/product');

//Obtener todos los productos.
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

//Obtener productos por codigo.
const productByCode = async (req, res) =>
    {
       try 
       {
        const codigoStr = req.params.codigo;

        //Validar que el codigo sea un numero valido.
        if (isNaN(codigoStr)) 
            {
                return res.status(400).json({ mensaje: 'El codigo debe ser un numero valido' });
            }

        const codigo = Number(codigoStr);
        const producto = await productDB.findOne({ codigo });

        if (!producto) 
            {
                return res.status(400).json({ mensaje: 'Producto no encontrado o no existe.' });
            }
        res.status(200).json(producto);

       } catch (error)
       {
        res.status(500).json({ error: 'Error al buscar el producto.' });
       }
    };

//Crear un nuevo producto.
const createProduct = async (req, res) => 
    {
        try 
        {
            const { codigo, nombre, precio, categoria } = req.body;

            //Validacion de campos requeridos.
            if(!codigo || !nombre || !precio || !categoria )
                {
                    return res.status(400).json({ mensaje: 'Faltan campos obligatorios '});
                }
            //Validacion de tipo de datos.
            if (typeof codigo !== 'number' || typeof nombre !== 'string' || typeof precio !== 'number' || !Array.isArray(categoria))
                {
                    return res.status(400).json({ mensaje: 'Datos invalidos: revisa los tipos de cada campo' });
                }

            //verificar unicidad del codigo.
            const existe = await productDB.findOne({ codigo });

            if (existe)
                {
                    return res.status(409).json({ mensaje: 'El codigo ya esta en uso o el producto ya existe' });
                }
            
            const nuevoProducto = await productDB.create({ codigo, nombre, precio, categoria });
            res.status(201).json(nuevoProducto);

        } catch (error)
        {
            res.status(500).json({ error: 'Error al crear el producto '});
        }
    };

//Actualizar un producto existente.
const updateProduct = async (req, res) =>
    {
        try 
        {
            const codigoStr = req.params.codigo;

            //validacion que el codigo debe ser numerico.
            if(isNaN(codigoStr))
                {
                    return res.status(400).json({ mensaje: 'El codigo debe ser un numero valido' });
                }
            
            const codigo = Number(codigoStr);
            const cambios = req.body

            //Validar que se hayan enviado campos a modificar.
            if(!cambios || Object.keys(cambios).length === 0)
                {
                    return res.status(400).json({ mensaje: 'No se enviaron datos para actualizar' });
                }
            
            //Evitar la modificacion del codigo de producto.
            if ('codigo' in cambios)
                {
                    return res.status(400).json({ mensaje: 'No se puede modificar el codigo del producto' });
                }

            const productoActualizado = await productDB.findOneAndUpdate 
            (
                { codigo },
                cambios,
                { new: true }
            );

            if (!productoActualizado) 
                {
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }
            res.status(200).json(productoActualizado);
        }catch (error)
        {
            res.status(500).json({ error: 'Error al modificar el producto' });
        }
    };

//Borrar un producto.
const deleteProduct = async (req, res) =>
    {
        try 
        {
            const codigoStr = req.params.codigo;

            //Validacion de codigo numerico.
            if(isNaN(codigoStr))
                {
                    return res.status(400).json({ mensaje: 'El codigo debe ser un nuermo valido' });
                }

            const codigo = Number(codigoStr);
            const resultado = await productDB.deleteOne({ codigo });

            if (resultado.deletedCount === 0) 
                {
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }
            
            res.status(200).json({ mensaje: `Producto con codigo ${codigo} eliminado correctamente` });
        }catch (error)
        {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    };

//Buscar un producto por termino en el nombre.
const searchProduct = async (req, res) => 
    {
        try 
        {
            const q = req.query.q?.trim();

            if (!q)
                {
                    return res.status(400).json({ mensaje: 'falta el parametro de busqueda' });
                }

            const productos = await productDB.find({ nombre: { $regex: q, $options: 'i' } });
            const respuesta = 
            {
                cantidad: productos.length,
                resultados: productos
            };

            if (productos.length === 0)
                {
                    respuesta.mensaje = 'No se encontraron productos';
                }
            res.status(200).json(respuesta);
        }catch (error)
        {
            res.status(500).json({ error: 'Error al buscar productos' });
        }
    };

//Obtener productos por categoria.
const productsByCategories = async (req, res) => 
    {
        try 
        {
            const categoriaRaw = req.params.nombre;

            if (!categoriaRaw || categoriaRaw.trim() === '')
                {
                    return res.status(400).json({ mensaje: 'Debe proporcionar una categoria valida' });
                }

            const categoria = categoriaRaw.trim();
            const productos = await productDB.find({ categoria: { $regex: categoria, $options: 'i' }});

            if (productos.length === 0)
                {
                    return res.status(404).json({ mensaje: 'No se encontraron productos para esa categoria' });
                }
            res.status(200).json(productos);
        }catch (error)
        {
            res.status(500).json({ error: 'Error al filtrar por categoria' });
        }
    };

//Obtener productos por rango de precio.
const productsByPrice = async (req, res) =>
    {
        try
        {
            const { min, max } = req.params;
            
            if (!min || !max )
                {
                    return res.status(400).json({ mensaje: 'Debe proporcionar ambios valores: minimo y maximo '});
                }

            const minPrecio = Number(min);
            const maxPrecio = Number(max);

            if (isNaN(minPrecio) || isNaN(maxPrecio)) 
                {
                    return res.status(400).json({ mensaje: 'Los parametros de precio debe ser numeros validos' });
                }

            if (minPrecio > maxPrecio)
                {
                    return res.status(400).json({ mensaje: 'El precio minimo no puede ser mayor que el maximo' });
                }

            const productos = await productDB.find({precio: { $gte: minPrecio, $lte: maxPrecio }});

            if(productos.length === 0)
                {
                    return res.status(404).json({ mensaje: 'No se encontraron productos en ese rango de precio' });
                }
            res.status(200).json(productos);
        } catch (error) 
        {
            res.status(500).json({ error: 'Error al filtrar por rango de precio' });
        }
    };

//Carga masiva de productos.
const massiveProductsLoad = async (req, res) =>
    {
        try 
        {
            const productos = req.body;

            //Validar que no sea un array vacio.
            if (!Array.isArray(productos) || productos.length === 0)
                {
                    return res.status(400).json({ mensaje : 'Se debe enviar un arreglo de productos no vacio' });
                }
            
            //Validar codigos duplicados.
            const codigos = productos.map(p => p.codigo);
            const codigosUnicos = new Set(codigos);
            
            if(codigos.length !== codigosUnicos.size)
                {
                    return res.status(400).json({ mensaje: 'Hay codigos repetidos en la lista enviada '});
                }

            //Validar que los codigos no existan en la Database.
            const existentes = await productDB.find({ codigo: { $in: codigos } });
            
            if(existentes.length > 0)
                {
                    return res.status(409).json
                    (
                        {
                            mensaje: 'Algunos codigos ya existen en la base de datos',
                            codigos: existentes.map(p => p.codigo)
                        });
                }

            //Validar estructura y tipos de cada producto.
            const errores = [];
            productos.forEach(({ codigo, nombre, precio, categoria }, i) => 
                {
                    if 
                    (
                        typeof codigo !== 'number' ||
                        typeof nombre !== 'string' ||
                        typeof precio !== 'number' ||
                        !Array.isArray(categoria)
                    )
                    {
                        errores.push(`Producto en posicion ${i} tiene datos invalidos` );
                    }
                });

            if (errores.length > 0)
                {
                    return res.status(400).json({ mensaje: 'Error en la validacion de los productos', errores });
                }

            //Insertar productos validos.
            const nuevosProductos = await productDB.insertMany(productos);
            res.status(201).json
            (
                {
                    mensaje: 'Productos creados correctamente',
                    cantidad: nuevosProductos.length,
                    nuevosProductos
                }
            );

        }catch (error)
        {
            res.status(500).json({ error: 'Error en la carga masiva de productos' });
        }
    };


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