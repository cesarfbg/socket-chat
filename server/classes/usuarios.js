class Usuarios {
    
    constructor() {
        this.personas = [];
    }

    agregarPersona( id, nombre, sala ) {
        let persona = { id, nombre, sala }
        this.personas.push(persona);
        return this.personas;
    }

    getPersona( id ) {
        let persona = this.personas.find((persona) => {
            return persona.id === id;
        });
        return persona;
    }

    getPersonas() {
        return this.personas;
    }
    
    borrarPersona( id ) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter((persona) => {
            return persona.id !== id;
        });
        return personaBorrada;
    }
    
    getPersonasPorSala( sala ) {
        let personasEnSala = this.personas.filter((persona) => {
            return persona.sala === sala;
        });
        return personasEnSala;
    }
    
}

module.exports = {Usuarios};