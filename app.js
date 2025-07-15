const express = require('express')
const connectDB = require('./config/database')
const routes = require('./routes/productRoutes')
const controllers = require('./controllers/productController')
const fs = require('fs')
const path = require('path')
const { productDB } = require('./models/product')

const app = express()

app.use(express.json())
app.use('/api/productos', routes);

app.get('/', (req, res) => 
    {
        res.send('Bienvenido a la API Backend.')
    });
app.get('/api', (req, res) => 
    {
        res.send('Bienvenido a /api. Proba /api/productos para obtener la lista de productos.')
    })

//Revisa que el archivo JSON de los productos se encuentre en MongoDB, de no estarlo lo sube, caso contrario pasa a conectar directamente.
const JSONProductos = async () =>
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

//Conexion 
const start = async () => 
    {
        try
        {
            await connectDB();
            await JSONProductos();
            app.listen(3000, () => console.log('Servidor funciando en el puerto 3000'))
        } catch (error)
        {
            console.error(error)
            process.exit(1)
        }
    }
   


start();

