//DEPENDENCIAS
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


//ARCHIVOS CREADOS POR MI
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';




//Asignamos express a la variable de app
const app = express();

//Con esta sintaxis le decimos a express que vamos estar utilizando datos de tipo de json, y de esta manera los podemos leer
app.use(express.json());

//Mandamos llamar dotenv para poder leer las variables de entorno
dotenv.config();

//Mandamos llamar la funcion de conectarDB y realizamos la conexion con la base de datos
conectarDB();


//Definimos los dominios o rutas permitidas
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {

        if (dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen del req esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));


//Estas son las rutas principales
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);



//Creamos una variable y le asignamos el valor de una variable de entorno. Tambien le asignamos un valor por default que en este caso seguira siendo el puerto 4000
const PORT = process.env.PORT || 4000;




app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})