import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";







const registrar = async (req, res) => {

    const { email, nombre } = req.body;

    //PREVIENIR USUARIOS DUPLICADOS
    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');

        return res.status(400).json({ msg: error.message });
    }


    try {
        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};








const perfil = (req, res) => {

    const { veterinario } = req;

    res.json({ veterinario });
}







//Con req.params podemos leer atributos que hayamos definido en la url, seguido de un punto y el nombre del atributo que deseamos leer
const confirmar = async (req, res) => {

    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido')

        return res.status(400).json({ msg: error.message });
    }


    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error)
    }
}







const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //COMPROBAR SI EL USUARIO EXISTE
    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }


    //COMPROBAR SI EL USUARIO YA CONFIRMO SU CUENTA
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    //REVISAR SI EL PASSWORD ES CORRECTO
    if (await usuario.comprobarPassword(password)) {

        //AUTENTICAR AL USUARIO
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
            web: usuario.web
        });

    } else {
        const error = new Error("El password es incorrecto");
        return res.status(400).json({ msg: error.message });
    }
}





const olvidePassword = async (req, res) => {

    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: 'Te hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error)
    }
}






const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        //EL TOKEN ES VALIDO EL USUARIO EXISTE
        res.json({ msg: 'Token valido y el usuario existe' });

    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }
}






const nuevoPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();

        res.json({ msg: 'Password modificado correctamente' })

        console.log(veterinario)
    } catch (error) {
        console.log(error)
    }
}





const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email })

        if (existeEmail) {
            const error = new Error('Ese Email ya esta registrado');
            return res.status(400).json({ msg: error.message })
        }
    }

    try {

        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();

        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error)
    }
}





const actualizarPassword = async (req, res) => {

    //leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;


    //comprobar que el usuario exista
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }


    //comprobar password actual
    if(await veterinario.comprobarPassword(pwd_actual)) {

        //Almacenar nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save()

        res.json({
            msg: 'Password actualizado con exito'
        })

    } else {
        const error = new Error('El Password actual es incorrecto');
        return res.status(400).json({ msg: error.message })
    }


    //Almacenar nuevo password
}


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};