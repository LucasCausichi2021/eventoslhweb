var pool = require('./bd');
var md5 = require('md5');

async function getUserAndPassword(user,password){
    try{
        var query = 'select * from Usuarios where usuario = ? and Contraseña = ? limit 1';
        var rows = await pool.query(query , [user, md5(password)]);
        return rows[0];//al 0 solo me trae 1 regiistro
    }catch(error){
        throw error
    }
}
//try - catch > estructura que controlas el manejo de errores

module.exports = { getUserAndPassword } //acordarse de exportar la funcion