const app = Vue.createApp({
    data() {
        return {
            // variables del login
            logeado: false,
            loginUsuario: '',
            loginPassword: '',
            errorLogin: '',

            // listas de datos
            listaEstudios: [],
            listaVideojuegos: [],
            
            // formularios
            formEstudio: { id: null, nombre: '', pais: '' },
            errorEstudio: '',

            formVideojuego: { id: null, titulo: '', anio: '', genero: '', estudio_id: '' },
            errorVideojuego: ''
        }
    },
    mounted() {
        // aqui ya no cargamos nada por defecto, hay que logearse primero
    },
    methods: {
        // --- LOGICA DE LOGIN ---
        async hacerLogin() {
            this.errorLogin = '';
            
            if (this.loginUsuario === '' || this.loginPassword === '') {
                this.errorLogin = 'rellena usuario y contraseña';
                return;
            }

            // preguntamos al backend si existe
            const respuesta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: this.loginUsuario, password: this.loginPassword })
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                // si va bien, entramos y cargamos los datos
                this.logeado = true;
                this.loginUsuario = '';
                this.loginPassword = '';
                this.cargarEstudios();
                this.cargarVideojuegos();
            } else {
                // si falla, mostramos el error del backend
                this.errorLogin = datos.mensaje;
            }
        },

        cerrarSesion() {
            this.logeado = false;
            // limpiamos datos por seguridad al salir
            this.listaEstudios = [];
            this.listaVideojuegos = [];
        },

        // --- LOGICA DE ESTUDIOS ---
        async cargarEstudios() {
            const respuesta = await fetch('http://localhost:3000/estudios');
            this.listaEstudios = await respuesta.json();
        },
        
        async guardarEstudio() {
            this.errorEstudio = '';
            
            if (this.formEstudio.nombre === '') {
                this.errorEstudio = 'el nombre del estudio es obligatorio';
                return;
            }

            if (this.formEstudio.id) {
                await fetch('http://localhost:3000/estudios/' + this.formEstudio.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formEstudio)
                });
            } else {
                await fetch('http://localhost:3000/estudios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formEstudio)
                });
            }

            this.cancelarEdicionEstudio();
            this.cargarEstudios();
        },
        
        editarEstudio(estudio) {
            this.formEstudio.id = estudio.id;
            this.formEstudio.nombre = estudio.nombre;
            this.formEstudio.pais = estudio.pais;
        },
        
        cancelarEdicionEstudio() {
            this.formEstudio.id = null;
            this.formEstudio.nombre = '';
            this.formEstudio.pais = '';
            this.errorEstudio = '';
        },
        
        async borrarEstudio(id) {
            await fetch('http://localhost:3000/estudios/' + id, {
                method: 'DELETE'
            });
            this.cargarEstudios();
        },

        // --- LOGICA DE VIDEOJUEGOS ---
        async cargarVideojuegos() {
            const respuesta = await fetch('http://localhost:3000/videojuegos');
            this.listaVideojuegos = await respuesta.json();
        },

        async guardarVideojuego() {
            this.errorVideojuego = '';
            
            if (this.formVideojuego.titulo === '' || this.formVideojuego.estudio_id === '') {
                this.errorVideojuego = 'el titulo y elegir un estudio es obligatorio';
                return;
            }

            if (this.formVideojuego.id) {
                await fetch('http://localhost:3000/videojuegos/' + this.formVideojuego.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formVideojuego)
                });
            } else {
                await fetch('http://localhost:3000/videojuegos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formVideojuego)
                });
            }

            this.cancelarEdicionVideojuego();
            this.cargarVideojuegos();
        },

        editarVideojuego(juego) {
            this.formVideojuego.id = juego.id;
            this.formVideojuego.titulo = juego.titulo;
            this.formVideojuego.anio = juego.anio;
            this.formVideojuego.genero = juego.genero;
            this.formVideojuego.estudio_id = juego.estudio_id;
        },

        cancelarEdicionVideojuego() {
            this.formVideojuego.id = null;
            this.formVideojuego.titulo = '';
            this.formVideojuego.anio = '';
            this.formVideojuego.genero = '';
            this.formVideojuego.estudio_id = '';
            this.errorVideojuego = '';
        },

        async borrarVideojuego(id) {
            await fetch('http://localhost:3000/videojuegos/' + id, {
                method: 'DELETE'
            });
            this.cargarVideojuegos();
        }
    }
});

app.mount('#app');