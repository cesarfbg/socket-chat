const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();
const { crearMensaje } = require('../util/util');

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {
        if ( !usuario.nombre || !usuario.sala ) {
            return callback({
                ok: false,
                err: {
                    message: 'El nombre/sala es necesario'
                }
            });
        }
        client.join(usuario.sala);
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        const personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', {
            usuario: 'Administrador',
            mensaje: crearMensaje('Administrador', `${personaBorrada.nombre} salió`)
        });
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        client.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});