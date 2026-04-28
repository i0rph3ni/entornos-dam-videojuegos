const app = Vue.createApp({
    data() {
        return {
            logeado: false,
            loginUsuario: '',
            loginPassword: '',
            errorLogin: '',

            listaEstudios: [],
            listaVideojuegos: [],
            
            formEstudio: { id: null, nombre: '', pais: '' },
            errorEstudio: '',

            // añadimos la variable archivoImagen para guardar la foto antes de enviarla
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

        // --- VIDEOJUEGOS ---
        async cargarVideojuegos() {
            const respuesta = await fetch('http://localhost:3000/videojuegos');
            this.listaVideojuegos = await respuesta.json();
        },

        // pillamos el archivo cuando el usuario lo selecciona
        seleccionarImagen(event) {
            this.formVideojuego.archivoImagen = event.target.files[0];
        },

        async guardarVideojuego() {
            this.errorVideojuego = '';
            if (this.formVideojuego.titulo === '' || this.formVideojuego.estudio_id === '') {
                this.errorVideojuego = 'el titulo y elegir un estudio es obligatorio';
                return;
            }

            // como enviamos un archivo, usamos FormData en vez de JSON
            const formData = new FormData();
            formData.append('titulo', this.formVideojuego.titulo);
            formData.append('anio', this.formVideojuego.anio);
            formData.append('genero', this.formVideojuego.genero);
            formData.append('estudio_id', this.formVideojuego.estudio_id);
            
            // si hay foto seleccionada, la metemos al paquete
            if (this.formVideojuego.archivoImagen) {
                formData.append('imagen', this.formVideojuego.archivoImagen);
            }

            if (this.formVideojuego.id) {
                // actualizar
                await fetch('http://localhost:3000/videojuegos/' + this.formVideojuego.id, {
                    method: 'PUT',
                    body: formData // ya no hace falta poner headers de content-type con formData
                });
            } else {
                // crear
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
            // la imagen no se carga en el input file por seguridad de los navegadores web
        },

        cancelarEdicionVideojuego() {
            this.formVideojuego.id = null;
            this.formVideojuego.titulo = '';
            this.formVideojuego.anio = '';
            this.formVideojuego.genero = '';
            this.formVideojuego.estudio_id = '';
            this.formVideojuego.archivoImagen = null;
            this.errorVideojuego = '';
            
            // vaciamos el input de la foto visualmente
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