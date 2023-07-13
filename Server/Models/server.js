let express = require("express");
let sha1 = require("sha1");
let session = require("express-session");
let cookie = require("cookie-parser");

class Server {
    constructor(){ //agregar variables que usa el constructor
        this.app = express ();//aplicacion  toma referencia del framework express
        this.port = process.env.PORT;//puerto por el que se va a comunicar nuestro servidor toma como referencia Port de env
        this.middlewares();
        this.routes();

       }
    
    middlewares(){ //vamos a decir donde estan las paginas estaticas, agregar caracteristicas a nuestro servidor
        this.app.use(express.static('Public'));
        //View engine
        this.app.set('view engine', 'ejs');//establecer motor de vistas
        this.app.use(cookie());

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));


    }

    routes(){
        this.app.get('/hola',(req, res) => { //respuesta del servidor, dentro del parentesis iran los parametros
          if (req.session.user){
            if(req.session.user.rol == 'admin'){
              res.send("<h1 style= 'color: red;'>Hola amiguito iniciaste como Administrador!!!</h1>");

            }
            else{
              res.send("<h1 style= 'color: red;'>iniciaste como peon!!!</h1>")
            }

          }
          else{
            res.send("<h1 style= 'color: red;'>Contraseña incorrecta!!!</h1>")
          }
                  
          
        
        });
          this.app.get('/login',(req,res)=>{
                let usuario = req.query.nombre_usuario;
                let contraseña = req.query.contraseña;

                // Cifrado sha1
                let passSha1 = sha1(contraseña);
                //////////////////////////

                let mysql = require('mysql');

                  let con = mysql.createConnection({
                
                  host: "localhost",
                  user: "root",
                  password: "A123456789-bc",
                  database: "escuela"
            });

            con.connect(function(err) {
                
              if (err) throw err;
              console.log("Connected!");
              let sql = "select * from usuario where nombre_usuario= '"+ usuario + "'";
              con.query(sql, function (err, result) {
                
                if (err) throw err;
                if (result.length > 0)
                if(result[0].contraseña == passSha1){
                  //sesion
                  let user = {
                    nam: usuario,
                    psw: contraseña,
                    rol: result[0].rol
                  }
                    req.session.user=user
                    req.session.save();
                    res.render("inicio", {nombre: result[0].nombre_usuario,
                    rol: result[0].rol});
                 
                
              }
                else 
                  res.render ("login", {error: "contraseña incorrecta!!!"});//cambiar sender por render para llamar a la vista
                else 
                  res.render ("login", {error: "usuario no existe!!!"});

              });
            });
          });
  
              //Ruta dar de Baja Alumnos
                    
            //Ruta Registrar
            this.app.get("/registrar", (req, res) => {
                let matricula = req.query.matricula;
                let nombre = req.query.nombre;
                let cuatrimestre = req.query.cuatrimestre;
                let mysql = require('mysql');
                



                let con = mysql.createConnection({
                
                  host: "localhost",
                
                  user: "root",
                
                  password: "A123456789-bc",
                
                  database: "escuela"

                  
                
                });
                
                
                
                
                con.connect(function(err) {
                
                  if (err) throw err;
                
                  console.log("Connected!");
                
                  //Insert a record in the "customers" table:
                
                  let sql = "INSERT INTO alumno values("+matricula+",'"+nombre+"','"+cuatrimestre+"')";
                
                                 
                  // codigo para enviar la consulta
                
                  con.query(sql, function (err, result) {
                
                    if (err) throw err;
               
                    res.render("registrado", {matricula: matricula, nombre: nombre , cuatrimestre: cuatrimestre});
                    console.log("1 record inserted");
                  });

                });


            });


            this.app.get("/registrarcurso", (req, res) => {
                let curso = req.query.curso;
                let nombre = req.query.nombre;
                let mysql = require('mysql');




                let con = mysql.createConnection({
                
                  host: "localhost",
                
                  user: "root",
                
                  password: "A123456789-bc",
                
                  database: "escuela"
                
                });
                
                
                
                
                con.connect(function(err) {
                
                  if (err) throw err;
                
                  console.log("Connected!");
                
                  //Insert a record in the "customers" table:
                
                  let sql = "INSERT INTO curso values("+curso+",'"+nombre+"')";
                
                                 
                  // codigo para enviar la consulta
                
                  con.query(sql, function (err, result) {
                
                    if (err) throw err;
               
                    res.render("registradocurso", {curso: curso, nombre: nombre});
                    console.log("1 record inserted");
                  });

                });


            });

            this.app.get("/inscrito", (req, res) => {
              let matricula = req.query.matricula;
              let curso = req.query.curso;
              let mysql = require('mysql');




              let con = mysql.createConnection({
              
                host: "localhost",
              
                user: "root",
              
                password: "A123456789-bc",
              
                database: "escuela"
              
              });
              
              
              
              
              con.connect(function(err) {
              
                if (err) throw err;
              
                console.log("Connected!");
              
                //Insert a record in the "customers" table:
              
                let sql = "INSERT INTO inscrito values("+matricula+",'"+curso+"')";
              
                               
                // codigo para enviar la consulta
              
                con.query(sql, function (err, result) {
              
                  if (err) throw err;
             
                  res.render("registradoinscrito", {matricula: matricula, curso: curso});
                  console.log("1 record inserted");
                });

              });


          });

          this.app.get("/bajas", (req, res) => {
            let matricula = req.query.matricula;
            let nombre = req.query.nombre;
            let cuatrimestre = req.query.cuatrimestre;
            let mysql = require('mysql');




            let con = mysql.createConnection({
            
              host: "localhost",
            
              user: "root",
            
              password: "A123456789-bc",
            
              database: "escuela"
            
            });
            
            
            
            
            con.connect(function(err) {
            
              if (err) throw err;
            
              console.log("Connected!");
            
              //Insert a record in the "customers" table:
            
              let sql = "INSERT INTO bajas values("+matricula+",'"+nombre+"','"+cuatrimestre+"')";
            
                             
              // codigo para enviar la consulta
            
              con.query(sql, function (err, result) {
            
                if (err) throw err;
           
                res.render("registradobajas", {matricula: matricula, nombre: nombre , cuatrimestre: cuatrimestre});
                console.log("1 record inserted");
              });

            });


        });


           
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log("http://127.0.0.1:" + this.port); //puerto de Salida
        });
    }
}
module.exports = Server;
