var express = require('express');
var usuarioModel = require('./../../model/usuarioModel');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {
      layout: 'admin/layout'
  });
});
/*para destruir variables e session*/
router.get('/logout', function (req, res,next){
  req.session.destroy();
  res.render('admin/login',{
    layout: 'admin/layout'
  });
});

router.post('/', async (req, res, next) => {

  try {
    var usuario = req.body.usuario;
    var password = req.body.password;
    console.log(req.body);

    var data = await usuarioModel.getUserAndPassword(usuario,password);

    if (data != undefined) {
      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;
      res.redirect('/admin/promociones');

    } else {
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true
      });
    }

  } catch (error) {
    console.log(error)
  }
});

module.exports = router;

module.exports = router;