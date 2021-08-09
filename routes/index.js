var express = require('express');
var router = express.Router();
 var nodemailer = require('nodemailer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 

    isIndex:true,
    
    
    
   
    
  });
});

router.post('/', async(req, res, next) => {
  console.log(req.body);
  var nombre = req.body.nombre;
  var email = req.body.email;
  var mensaje = req.body.mensaje;

  var obj ={
    to: 'luksmikegraphic@hotmail.com',
    subjet: 'Contacto desde la web de Eventos LH',
    html: nombre + ' se contacto a travez de la web y quiere mas info de este correo ' 
    + email + '.<br> Ademas hizo el siguiente comentario ' 
    + mensaje 
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS

    }

    
  });

  var info = await transport.sendMail(obj);

  res.render('index', {
    isIndex:true,
    message : 'Mensaje enviado correctamente'
    

    
   
  });
});




module.exports = router;
