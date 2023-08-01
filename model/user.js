require('rootpath')();

var usuario_db = {};

const { query } = require('express');
const mysql = require('mysql');
const configuracion = require("config.json");


var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});


//-- antes -------------------------------------------------------------------
//teniamos un solo archivo que era el index //codificaba todo en la misma funcion


//-- ahora -------------------------------------------------------------------
//tenemos 2 archivos que son el persona_index y la persona_BD
//tengo que codificar en dos funciones y comunicarme entre ellas
//persona_index (interaccion con el servidor): se encargara de mandarle los mensajes al frontend y de hacer peticiones a persona_BD  
//persona_BD (interaccion con la base de datos): recibira peticiones de persona_index y debera devolver una respuesta
//¿como me comunico?: una forma invocar(mandar una funcion [carretilla vacia]) ---> atender (recibir la funcion que me mandaron)
//persona_BD are lo que tenga que hacer y enviare mis datos a la funcion que me enviaron [llenar la carretilla]




usuario_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM usuario';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}



usuario_db.create = function (usuario, funcallback) {
    consulta = "INSERT INTO usuario (mail, nickname, pass) VALUES (?,?,?);";
    params = [usuario.mail, usuario.nickname, usuario.pass];

    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensajito: "el usuario ya fue registrada",
                    detalle: err
                });
            } else {
                funcallback({
                    mensajito: "error diferente",
                    detalle: err
                });
            }
        } else {

            funcallback(undefined, {
                mensajito: "se creo la el usaurio " + usuario.nickname,
                detalle: detail_bd
            });
        }
    });
}

usuario_db.update = function(usuario, funcallback) {
    const consulta = "UPDATE usuario SET nickname = ?, pass = ? WHERE mail = ?";
    const params = [usuario.nickname, usuario.pass, usuario.mail];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasar "null" como primer parámetro indica que no hay error.
        }
    });
};


usuario_db.borrar = function (id_p_e, retorno) { //DELETE
    consulta = "DELETE FROM usuario WHERE mail = ?";
    parametro = id_p_e;

    connection.query(consulta, parametro, (err, result) => {
        if(err) {
            retorno({message: err.code, detail: err}, undefined);
        }else{
            retorno(undefined, {message: `La persona ${id_p_e} fue eliminada correctamente`,
            detail: result});
        }
    })
};

usuario_db.getByEmail = function(mail, funcallback) {
    const consulta = "SELECT mail FROM usuario";
    const params = mail;

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasar el resultado de la consulta como información de las personas con el apellido especificado.
        }
    });
};


 
        
    
        

    
            


module.exports = usuario_db;