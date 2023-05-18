//cuenta POST /api/register
//  El usuario puede iniciar sesión con nombre de usuario y contraseña. POST /api/login

//    El usuario con sesión puede tener acceso a la lista de usuarios registrados 
//GET /api/users
//- los usuarios sin sesión no pueden acceder a la lista de usuarios

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.listen(8000, () => {
    console.log("Express runing");
});

const users = [
    {
        username: "arturo",
        password: "arturo1"
    }
]

const secret = "secret";


app.post("/create", (req, res) => {

    const { username, password } = req.body;

    let usuarioBuscado = users.find((user) => {
        return username === user.username;
    });

    if (usuarioBuscado !== undefined) {
        return res.status(400).json({
            text: "Usuario Existente"
        });
    };

    users.push({ username, password });
    console.log(users);
    return res.status(201).json({
        text: "Usuario creado con exito"
    })

});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    let usuarioBuscado = users.find((user) => {
        return username === user.username && password === user.password;
    });

    if (usuarioBuscado === undefined) {
        return res.status(400).json({
            text: "Usuario incorrecto"
        });
    }

    const token = jwt.sign({
        username,
        exp: Date.now() + 60 * 1000
    }, secret);

    return res.status(201).json({ token });

});

//Bearer token

app.get("/users", (req, res) => {

    try {
        const token = req.headers.authorization.split(" ")[1];

        const payload = jwt.verify(token,secret);

        if( Date.now() > payload.exp) {
            return res.status(400).json({
                text: "Token Expirado"
            })
        }

        return res.status(200).json({users});

    } catch (error) {

        return res.status(401).json({
            text: "Usuario no autorizado"
        })
    }


});


