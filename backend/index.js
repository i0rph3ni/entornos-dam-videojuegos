const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// crear carpeta uploads si no existe para guardar las fotos
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// hacer publica la carpeta uploads para poder ver las fotos en el html
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// configuracion de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // renombra la foto para que no haya nombres repetidos
    }
});
const upload = multer({ storage: storage });

// --- RUTAS PARA ESTUDIOS ---
app.get('/estudios', (req, res) => {
    db.all("SELECT * FROM estudios", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/estudios', [
    body('nombre').notEmpty().withMessage('el nombre es obligatorio')
], (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { nombre, pais } = req.body;
    db.run("INSERT INTO estudios (nombre, pais) VALUES (?, ?)", [nombre, pais], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, pais });
    });
});

app.put('/estudios/:id', (req, res) => {
    const { nombre, pais } = req.body;
    db.run("UPDATE estudios SET nombre = ?, pais = ? WHERE id = ?", [nombre, pais, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "estudio actualizado ok" });
    });
});

app.delete('/estudios/:id', (req, res) => {
    db.run("DELETE FROM estudios WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "estudio borrado" });
    });
});

// --- RUTAS PARA VIDEOJUEGOS ---
app.get('/videojuegos', (req, res) => {
    db.all("SELECT * FROM videojuegos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// metemos upload.single('imagen') para pillar la foto
app.post('/videojuegos', upload.single('imagen'), [
    body('titulo').notEmpty().withMessage('falta el titulo del juego'),
    body('estudio_id').notEmpty().withMessage('el id del estudio es obligatorio')
], (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { titulo, anio, genero, estudio_id } = req.body;
    const imagen = req.file ? req.file.filename : null; // pillamos el nombre de la foto si la han subido

    db.run("INSERT INTO videojuegos (titulo, anio, genero, estudio_id, imagen) VALUES (?, ?, ?, ?, ?)",
        [titulo, anio, genero, estudio_id, imagen], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, titulo, anio, genero, estudio_id, imagen });
    });
});

app.put('/videojuegos/:id', upload.single('imagen'), (req, res) => {
    const { titulo, anio, genero, estudio_id } = req.body;
    
    if (req.file) {
        // si editan y suben foto nueva
        const imagen = req.file.filename;
        db.run("UPDATE videojuegos SET titulo = ?, anio = ?, genero = ?, estudio_id = ?, imagen = ? WHERE id = ?",
            [titulo, anio, genero, estudio_id, imagen, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "juego actualizado con foto ok" });
        });
    } else {
        // si editan solo el texto y dejan la foto que estaba
        db.run("UPDATE videojuegos SET titulo = ?, anio = ?, genero = ?, estudio_id = ? WHERE id = ?",
            [titulo, anio, genero, estudio_id, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "juego actualizado ok" });
        });
    }
});

app.delete('/videojuegos/:id', (req, res) => {
    db.run("DELETE FROM videojuegos WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "juego borrado" });
    });
});

// --- RUTA PARA LOGIN ---
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    db.get("SELECT * FROM usuarios WHERE usuario = ? AND password = ?", [usuario, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json({ exito: true });
        } else {
            res.status(401).json({ exito: false, mensaje: "Usuario o contraseña incorrectos" });
        }
    });
});

app.listen(PORT, () => {
    console.log("servidor escuchando en puerto " + PORT);
});