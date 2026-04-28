const app = Vue.createApp({
    data() {
        return {
            logeado: false,
            loginUsuario: '',
            loginPassword: '',
            errorLogin: '',

            listaEstudios: [],
            listaVideojuegos: [],
            
            // añadida variable archivoLogo
            formEstudio: { id: null, nombre: '', pais: '', archivoLogo: null },
            errorEstudio: '',

            formVideojuego: { id: null, titulo: '', anio: '', genero: '', estudio_id: '', archivoImagen: null },
            errorVideojuego: ''
        }
    },
    methods: {
        async hacerLogin() {
            this.errorLogin = '';
            if (this.loginUsuario === '' || this.loginPassword === '') {
                this.errorLogin = 'rellena usuario y contraseña';
                return;
            }
            const respuesta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: this.loginUsuario, password: this.loginPassword })
            });
            const datos = await respuesta.json();
            if (datos.exito) {
                this.logeado = true;
                this.loginUsuario = '';
                this.loginPassword = '';
                this.cargarEstudios();
                this.cargarVideojuegos();
            } else {
                this.errorLogin = datos.mensaje;
            }
        },

        cerrarSesion() {
            this.logeado = false;
            this.listaEstudios = [];
            this.listaVideojuegos = [];
        },

        // --- ESTUDIOS ---
        async cargarEstudios() {
            const respuesta = await fetch('http://localhost:3000/estudios');
            this.listaEstudios = await respuesta.json();
        },

        // pillar archivo del logo
        seleccionarLogo(event) {
            this.formEstudio.archivoLogo = event.target.files[0];
        },
        
        async guardarEstudio() {
            this.errorEstudio = '';
            if (this.formEstudio.nombre === '') {
                this.errorEstudio = 'el nombre del estudio es obligatorio';
                return;
            }

            // usamos FormData para enviar el logo
            const formData = new FormData();
            formData.append('nombre', this.formEstudio.nombre);
            formData.append('pais', this.formEstudio.pais);
            
            if (this.formEstudio.archivoLogo) {
                formData.append('logo', this.formEstudio.archivoLogo);
            }

            if (this.formEstudio.id) {
                // actualizar
                await fetch('http://localhost:3000/estudios/' + this.formEstudio.id, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                // crear
                await fetch('http://localhost:3000/estudios', {
                    method: 'POST',
                    body: formData
                });
            }
            this.cancelarEdicionEstudio();
            this.cargarEstudios();
        },
        
        editarEstudio(estudio) {
            this.formEstudio.id = estudio.id;
            this.formEstudio.nombre = estudio.nombre;
            this.formEstudio.pais = estudio.pais;
            // archivoLogo no se puede cargar por seguridad
        },
        
        cancelarEdicionEstudio() {
            this.formEstudio.id = null;
            this.formEstudio.nombre = '';
            this.formEstudio.pais = '';
            this.formEstudio.archivoLogo = null;
            this.errorEstudio = '';
            // limpiar input visualmente
            const inputLogo = document.getElementById('logoEstudio');
            if(inputLogo) inputLogo.value = '';
        },
        
        async borrarEstudio(id) {
            await fetch('http://localhost:3000/estudios/' + id, {
                method: 'DELETE'
            });
            this.cargarEstudios();
        },

        // --- VIDEOJUEGOS ---
        async cargarVideojuegos() {
            const respuesta = await fetch('http://localhost:3000/videojuegos');
            this.listaVideojuegos = await respuesta.json();
        },

        seleccionarImagen(event) {
            this.formVideojuego.archivoImagen = event.target.files[0];
        },

        async guardarVideojuego() {
            this.errorVideojuego = '';
            if (this.formVideojuego.titulo === '' || this.formVideojuego.estudio_id === '') {
                this.errorVideojuego = 'el titulo y elegir un estudio es obligatorio';
                return;
            }

            const formData = new FormData();
            formData.append('titulo', this.formVideojuego.titulo);
            formData.append('anio', this.formVideojuego.anio);
            formData.append('genero', this.formVideojuego.genero);
            formData.append('estudio_id', this.formVideojuego.estudio_id);
            if (this.formVideojuego.archivoImagen) {
                formData.append('imagen', this.formVideojuego.archivoImagen);
            }

            if (this.formVideojuego.id) {
                await fetch('http://localhost:3000/videojuegos/' + this.formVideojuego.id, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                await fetch('http://localhost:3000/videojuegos', {
                    method: 'POST',
                    body: formData
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
            this.formVideojuego.archivoImagen = null;
            this.errorVideojuego = '';
            const inputFoto = document.getElementById('fotoJuego');
            if(inputFoto) inputFoto.value = '';
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