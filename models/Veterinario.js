import mongoose from "mongoose";
import bcrypt from "bcrypt";

import generarID from "../helpers/generarID.js";



//dentro de los parentesis de Schema crearemos un objeto con todos los valores y la configuracion de nuestro modelo
const veterinarioSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    telefono: {
        type: String,
        default: null,
        trim: true
    },

    web: {
        type: String,
        default: null
    },

    token: {
        type: String,
        default: generarID()
    },

    confirmado: {
        type: Boolean,
        default: false
    }
});


//Hashear el password. Con .pre le decimos que ejecute lo que esta dentro del parentesis ANTES de, en este caso antes de SAVE o sea antes de guardar ejecuta la siguiente funcion
veterinarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {//Con esta linea evitamos que se vuelva a hashear un password ya hasheado

        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {

    return await bcrypt.compare(passwordFormulario, this.password);
}


//El nombre que definamos entre comillas dentro del parentesis, sera el nombre que mongoose le dara a la coleccion en la BD
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;


