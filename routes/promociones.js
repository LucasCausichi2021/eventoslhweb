var express = require('express');
var router = express.Router();
var promocionesModel = require('../model/promocionesModel');
var cloudinary = require('cloudinary').v2;

/* GET home promociones */
router.get('/', async function(req, res, next) {
  var promociones = await promocionesModel.getPromociones();

  promociones = promociones.map(promocion => {
    if (promocion.img_id) {
      const imagen = cloudinary.url(promocion.img_id, {
        width: 960,
        crop: 'pad'
      });
      return {
        ...promocion,
        imagen
      }
    }else {
      return {
        ...promocion,
        imagen: ''
      }
    }
  })


  res.render('Promociones',{ 
    isPromociones:true,
    promociones
    


   });
});


module.exports = router;