Proyecto Entornos de Desarrollo (AA2). 
Es una aplicación web con backend (Node.js + Express + SQLite) y frontend (HTML + Vue.js) para gestionar una base de datos de videojuegos y estudios de desarrollo.

Funcionalidades:
 CRUD completo para Estudios y Videojuegos.
 Relación entre tablas. Videojuego pertenece a un Estudio.
 Base de datos en SQLite.
 Validación en el servidor usando express-validator.
 Validación en el cliente antes de enviar el formulario.
 Frontend con framework Vue.js (CDN).
 Subida de imágenes (carátulas) mediante multer.
 Protección de la interfaz mediante Login de usuario.
 Gestión de código con Git, uso de ramas y Pull Requests.

Instrucciones:

Clonar el repositorio e instalar
Primero, descargar el código y abre una terminal en la carpeta del proyecto.
Entra en la carpeta del backend e instala las dependencias necesarias:
---
cd backend
npm install
---

Arrancar servidor Backend
Desde la carpeta raíz del proyecto:
---
bash
node backend/index.js
---
El servidor se inicia en http://localhost:3000 y crea automáticamente la base de datos videojuegos.sqlite y la carpeta uploads si no existen.

Arranco el Frontend
Vas a la carpeta frontend.
Abre el archivo index.html en tu navegador web. o boton derecho, open whit live server.
Credenciales por defecto:
Usuario: admin
Contraseña: 1234