require('dotenv').config(); // leemos la variables de .env
const express = require('express'); // importamos express
const path = require('path'); // usamos el módulo nativo de rutas

const app = express(); // creamos la instancia de la aplicación en la constante 'app'
const PORT = process.env.PORT || 3000; // usamos el puerto predefinido
app.use(express.json()); // permitimos acceso a los datos mediante req.body

app.use((req, res, next) => { // hacemos cálculo del tiempo de ejecución y obtenemos el código de respuesta
    const inicio = Date.now();
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(
            `[${new Date().toISOString()}] ` +
            `${req.method} ${req.originalUrl} ` +
            `${res.statusCode} ${duracion}ms`
        );
    });
    next();
});

app.use(express.static(path.join(__dirname, 'public'))); // usamos los archivos del frontend

app.get('/api/status', (req, res) => { // ruta de prueba
    res.status(200).json({
        status: 'OK',
        message: 'Servidor SIRPOU funcionando'
    });
});

app.use((err, req, res, next) => { // base del middleware de errores
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`SIRPOU disponible en http://localhost:${PORT}`);
});
