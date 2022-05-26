import express from "express";

const router = express.Router();

import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import checkAuth from "../middleware/authMiddleware.js";



//RUTAS

//RUTAS PUBLICAS----------------------------------------------------------------------------
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);//Valida el email del usuario que desea cambiar su password

//comprobarToken = Lee el token que se le envia al usuario
//nuevoPassword = Almacena el nuevo password
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);




//RUTAS QUE REQUIEREN AUTENTICACIÓN--------------------------------------------------
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);




export default router;