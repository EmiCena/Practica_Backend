require('rootpath')();

var persona_db = {};

const { query } = require('express');
const mysql = require('mysql');
const configuracion = require("config.json");

//Pre-Conexión a la BD
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




persona_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM persona';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}

persona_db.create = function(persona, funcallback) {
    const consulta = "INSERT INTO persona (dni, nombre, apellido) VALUES (?, ?, ?)";
    const params = [persona.dni, persona.nombre, persona.apellido];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado.insertId); // Pasar el ID de la nueva persona creada como resultado.
        }
    });
};

/* persona_db.create = function (persona, funcallback) {
    consulta = "INSERT INTO persona (dni, nombre, apellido) VALUES (?,?,?);";
    params = [persona.dni, persona.nombre, persona.apellido];

    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensajito: "La persona ya fue registrada",
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
                mensajito: "se creo la persona " + persona.nombre + persona.apellido,
                detalle: detail_bd
            });
        }
    });
} */

persona_db.update = function(persona, funcallback) {
    const consulta = "UPDATE persona SET nombre = ?, apellido = ? WHERE dni = ?";
    const params = [persona.nombre, persona.apellido, persona.dni];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasar "null" como primer parámetro indica que no hay error.
        }
    });
};



persona_db.borrar = function (id_p_e, retorno) { //DELETE
    consulta = "DELETE FROM persona WHERE dni = ?";
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

// Punto 6.
persona_db.getByApellido = function(apellido, funcallback) {
    const consulta = "SELECT apellido FROM persona";
    const params = apellido;

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasar el resultado de la consulta como información de las personas con el apellido especificado.
        }
    });
};

persona_db.getUserByPersona = function(dni,funcallback) {
    connection.query("SELECT * FROM persona WHERE dni = ?",dni,(err,respuesta) => {
        if (err) {
            funcallback({
                mensajito : "Ha ocurrido algún error, posiblemente de sintaxis en buscar la persona",
                detalle : err
            })
        } else if (respuesta.length == 0) {
            funcallback(undefined, {
                mensajito: "No se encontró la persona buscada.",
                detalle : respuesta
            })
        } else {
            consulta = "SELECT nickname from usuario INNER JOIN persona on usuario.persona = persona.dni and usuario.persona = ?";
            connection.query(consulta,dni,(err,r)=>{
                if (err) {
                    funcallback({
                        mensajito: "Ha ocurrido algún error, posiblemente de sintaxis en buscar el nickname",
                        detalle: err
                    });
                }else if (r.length == 0) {
                    funcallback(undefined, {
                        mensajito: "la persona seleccionada no posee usuario registrado en la base de datos",
                        detalle : r
                    })
                } else {
                    funcallback(undefined, {
                        mensajito: `El nickname de la persona seleccionada es ${r[0]["nickname"]}`,
                        detalle : r 
                    })
                }
            })
        }
    })
}



module.exports = persona_db;