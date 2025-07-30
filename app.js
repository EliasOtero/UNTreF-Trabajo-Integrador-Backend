//Importacion de los modulos necesarios.
const express = require('express')
const connectDB = require('./config/database')
const routes = require('./routes/productRoutes')
const fs = require('fs')
const path = require('path')
const { productDB } = require('./models/product')

const app = express()

app.use(express.json())
app.use('/api/productos', routes);

//Conexion ruta raiz - Bienvenida
app.get('/', (req, res) => 
    {
        res.send('Bienvenido a la API Backend.')
    });

//Conexion ruta base - '/api'
app.get('/api', (req, res) => 
    {
        res.send('Bienvenido a /api. Proba /api/productos para obtener la lista de productos.')
    })

//Carga los productos desde un archivo JSON solo si la base de datos está vacía.
//Evita duplicados si los datos ya se encuentran cargados en la base de datos.
const cargarProductosDesdeJSON = async () =>
    {
        const count = await productDB.countDocuments();
        if (count > 0)
            {
                console.log('El archivo JSON ya existe en la base de datos, procediendo a conectar.')
                    return;
            }
        const productJSON = fs.readFileSync(path.join(__dirname, 'data', 'computacion.json'), 'utf-8');
        const productos = JSON.parse(productJSON);

        await productDB.insertMany(productos);
        console.log('JSON cargado con exito.')
    }

//Inicializacion del servidor.
const start = async () => 
    {
        try
        {
            await connectDB();
            await cargarProductosDesdeJSON();
            const PORT = process.env.PORT || 3000;

            app.listen(PORT, () => console.log(`Servidor funciando en el puerto ${PORT}`));
        } catch (error)
        {
            console.error('Error al iniciar el servidor:', error);
            process.exit(1)
        }
    }

start();

