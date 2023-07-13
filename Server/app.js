require('dotenv').config(); //configura dotenv donde esta el puerto donde va a estar escuchando
const Server = require('./Models/server');// llamamos al archivo server, le decimos donde esta

const server = new Server();//creamos objeto server de la clase server
server.listen();// al objeto server como hereda todo lo de la clase server le agregamos el metodo listen 
