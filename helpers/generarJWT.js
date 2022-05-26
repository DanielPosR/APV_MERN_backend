import jwt from "jsonwebtoken";

//ESTA FUNCION NOS VA A CREAR UN JSON WEB TOKEN Y DENTRO DEL PARENTESIS DE .SIGN DEFINIMOS LA CONFIGURACION QUE VA A TENER EL TOKEN

const generarJWT = (id) => {

    return jwt.sign(
        {
            id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
}


export default generarJWT;