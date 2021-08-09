var pool = require('./bd');

/*sirve para listar las novedades*/
async function getPromociones(){
    var query = 'select * from Promociones';
    var rows = await pool.query(query);
    return rows;



}

/*sirve para agrgegar las novedaes*/

async function insertPromociones(obj){
    try{
        var query = 'insert into Promociones set ?';
        var rows = await pool.query(query,[obj]);
        return rows;

    }catch(error){
        console.log(error);
        throw error;
} 
}

/*sirve para eliminar novedades*/

async function deletePromocionesByid(id){
    var query = 'delete from Promociones where id = ? ';
    var rows = await pool.query(query,[id]);
    return rows;

}

/*Para traer(select) una novedad by id*/

async function getPromocionesByid(id) {
    var query = 'select * from Promociones where id = ? ';
    var rows = await pool.query(query,[id]);
    return rows[0];


}

/* para modificar el UPDATE de los datos*/

async function modificarPromocionesByid(obj,id) {
    try{
        var query = 'update Promociones set ? where id=?';
        var rows = await pool.query(query,[obj,id]);
        return rows;


    }catch(error){
        throw error;

    }
    
}


module.exports = { getPromociones, insertPromociones,  deletePromocionesByid , getPromocionesByid, modificarPromocionesByid }
    