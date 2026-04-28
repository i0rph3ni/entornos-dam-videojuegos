const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.post('/videojuegos', [
    body('titulo').notEmpty().withMessage('falta el titulo del juego'),
    body('estudio_id').isInt().withMessage('el id del estudio tiene que ser un numero')
], (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { titulo, anio, genero, estudio_id } = req.body;
    db.run("INSERT INTO videojuegos (titulo, anio, genero, estudio_id) VALUES (?, ?, ?, ?)",
        [titulo, anio, genero, estudio_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, titulo, anio, genero, estudio_id });
    });
});

app.put('/videojuegos/:id', (req, res) => {
    const { titulo, anio, genero, estudio_id } = req.body;
    db.run("UPDATE videojuegos SET titulo = ?, anio = ?, genero = ?, estudio_id = ? WHERE id = ?",
        [titulo, anio, genero, estudio_id, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "juego actualizado ok" });
    });
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
            // si encuentra el usuario, devuelve exito
            res.json({ exito: true });
        } else {
            // si no, da error de permisos
            res.status(401).json({ exito: false, mensaje: "Usuario o contraseña incorrectos" });
        }
    });
});

// arrancar el server
app.listen(PORT, () => {
    console.log("servidor escuchando en puerto " + PORT);
});