const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'videojuegos.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('error al conectar db:', err.message);
    } else {
        console.log('conectado a sqlite');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS estudios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        pais TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS videojuegos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        anio INTEGER,
        genero TEXT,
        estudio_id INTEGER,
        FOREIGN KEY (estudio_id) REFERENCES estudios(id)
    )`);

    // tabla para el login
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE,
        password TEXT
    )`, () => {
        // creamos un usuario admin por defecto para poder entrar (pass: 1234)
        db.get("SELECT * FROM usuarios WHERE usuario = 'admin'", (err, row) => {
            if (!row) {
                db.run("INSERT INTO usuarios (usuario, password) VALUES ('admin', '1234')");
            }
        });
    });
});

module.exports = db;