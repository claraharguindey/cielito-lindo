const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir timestamp al nombre del archivo
    }
});

const upload = multer({ storage: storage });

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la galería
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'gallery.html'));
});

// Ruta para subir el dibujo
app.post('/upload', upload.single('image'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'images', req.file.filename);

    fs.rename(tempPath, targetPath, err => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
    });
});

// Ruta para obtener las imágenes
app.get('/api/images', (req, res) => {
    fs.readdir(path.join(__dirname, 'images'), (err, files) => {
        if (err) return res.sendStatus(500);
        res.json(files);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
