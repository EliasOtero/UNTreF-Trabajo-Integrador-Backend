# 🛍️ Trabajo Integrador: API REST de Productos

¡Bienvenidos a mi API REST de gestión de productos!  
Este proyecto fue realizado como parte del trabajo integrador del curso de Backend de UNTREF.

📦 Catálogo elegido: **Computación**

---

## 🚀 Tecnologías Utilizadas

- **Node.js** y **Express** – Servidor y endpoints RESTful
- **MongoDB** – Base de datos no relacional
- **Mongoose** – ODM para modelado de datos
- **pnpm** – Gestor de paquetes rápido y eficiente
- **REST Client** / **Postman** – Herramientas para testeo de la API
- **dotenv** – Para manejar variables de entorno de forma segura

---

## ⚙️ Instrucciones para preparar y correr la aplicación

> Este proyecto utiliza `pnpm`. Si no lo tenés instalado, podés hacerlo así:

```bash
npm install -g pnpm
```

> También podés usar `npm`, pero `pnpm` es más rápido y eficiente.

### 1. Clonar el repositorio

```bash
git clone https://github.com/EliasOtero/UNTreF-Trabajo-Integrador-Backend.git
cd UNTreF-Trabajo-Integrador-Backend
```

### 2. Instalar las dependencias

```bash
pnpm install
```

> Si preferís usar `npm`, también funciona:

```bash
npm install
```

### 3. Configurar las variables de entorno

Renombrá el archivo `.env copy` a `.env` y completá los siguientes campos:

```env
PORT=
DB_PROTOCOL=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_OPTIONS=
DB_NAME=
```


### 4. Iniciar el servidor

```bash
pnpm dev
```

> También podés usar `pnpm start` si preferís correrlo sin nodemon.

El servidor estará escuchando en:  
```
http://localhost:3000
```

---

## 🧪 Cómo testear la API

### ✅ Opción 1: REST Client (Visual Studio Code)

1. Instalá la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
2. Abrí el archivo `api.http` incluido en el proyecto.
3. Hacé clic en **"Send Request"** sobre cada endpoint para probarlo.

### ✅ Opción 2: Postman

Podés testear manualmente copiando los endpoints desde `api.http` o creando tus propias peticiones en Postman.  
Base URL:

```
http://localhost:3000/api/productos
```

---

## ✅ Endpoints implementados

### CRUD Básico
- `GET /productos` → Obtener todos los productos
- `GET /productos/:codigo` → Buscar por código
- `POST /productos` → Crear producto
- `PUT /productos/:codigo` → Editar producto
- `DELETE /productos/:codigo` → Eliminar producto

### Endpoints Adicionales
- `GET /productos/buscar?q=notebook` → Buscar por nombre (query)
- `GET /productos/categoria/:nombre` → Filtrar por categoría
- `GET /productos/precio/:min-:max` → Filtrar por precio
- `POST /productos/masivo` → Carga masiva de productos

Todos los endpoints cuentan con validación de datos y manejo de errores.

---

## 🗂️ Estructura del Proyecto

```
/controllers         # Lógica de las rutas (productController.js)
/config              # Conexión a MongoDB (database.js)
/data                # Archivos JSON de productos
/models              # Schema de Producto (product.js)
/routes              # Rutas de la API (productRoutes.js)
.env copy            # Archivo de ejemplo para quienes clonen el repo
.gitignore           # Ignora node_modules y .env
api.http             # Archivo de testeo para REST Client
package.json         # Configuración del proyecto y scripts
pnpm-lock.yaml       # Lockfile para versiones consistentes de dependencias
app.js               # Archivo principal del servidor
README.md            # Documentación principal del proyecto
README.md2           # Documentación alternativa por mi
```

---

## 📝 Comentarios Finales

- Todos los endpoints fueron probados exitosamente usando tanto **REST Client** como **Postman**.
- La base de datos se pobla automáticamente desde el JSON de computación si está vacía.
- El código fue organizado por capas (modelo, rutas, controlador) para mantener buena estructura.
- El código está comentado para facilitar su comprensión y mantenimiento.

---

## ✉️ Autor

**Elias Otero**  
Estudiante de Backend – UNTREF  
🔗 [GitHub](https://github.com/EliasOtero)

