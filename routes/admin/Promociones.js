const { Router } = require('express');
var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var promocionesModel = require('./../../model/promocionesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


/* GET home page. */
router.get('/', async function (req, res, next) {
 var Promocion = await promocionesModel.getPromociones();

 Promocion = Promocion.map(Promocion => {
   if (Promocion.img_id) {
     const imagen = cloudinary.image(Promocion.img_id, {
       width: 80,
       height: 80,
       crop: 'fill'
     });
     return {
       ...Promocion,
       imagen
     }

   }else {
     return{
       ...Promocion,
       imagen: ''
     }
   }
 });
  
  res.render('admin/Promociones', {
    layout: 'admin/layout' ,
    usuario: req.session.nombre ,
    Promocion

  });
});
/*llamamos pagina /agregar*/

router.get('/agregar', (req, res, next) =>{
  res.render('admin/agregar', { 
    layout: 'admin/layout'
  });


});

/*procesa agregar novedades a la BD  POST*/

router.post('/agregar', async (req, res, next) =>{
  try {

    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {

      await promocionesModel.insertPromociones({
        ...req.body,
        img_id
      });
      res.redirect('/admin/Promociones')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los datos tienen que completarse'
      })
    }

  } catch (error) {
    console.log(error);
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo la promocion'
    })

  }
});

router.get('/eliminar/:id', async(req,res,next) => {
  let id = req.params.id;

  let promocion = await promocionesModel.getPromocionesByid(id);
  if (promocion.img_id) {
    await (destroy(promocion.img));
  }
  await promocionesModel.deletePromocionesByid(id);
  res.redirect('/admin/Promociones')


});//cierra get de eliminare

/*para listar una sola novedad by id*/

router.get('/modificar/:id', async(req,res,next) =>{
  var id = req.params.id;
  var Promocion = await promocionesModel.getPromocionesByid(id);

  res.render('admin/modificar', {
    layout:'admin/layout',
    Promocion
  });

}); //cierra el traer una sola novedad by id

/*para modificar la novedad*/
router.post('/modificar', async (req, res, next) =>{
  try {

    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if(req.body.img_delete === "1"){
      img_id = null;
      borrar_img_vieja = true;

    }else{
      if(req.files && Object.keys(req.files).lenght > 0){
        imagen= req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }

    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));


    }




    var obj = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      cuerpo: req.body.cuerpo,
      img_id
    }

    await promocionesModel.modificarPromocionesByid(obj, req.body.id);
    res.redirect('/admin/Promociones');

  }
  catch (error) {
    console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico la promocion'
    })
  }
})


module.exports = router;