const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const Estudiante = require('./models/estudiante');
const Curso = require('./models/curso');
const Inscrito = require('./models/inscrito');
const session = require('express-session');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/* const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}; */





require ('./helpers');

const directoriopartials = path.join(__dirname,'../partials');
const directorioviews = path.join(__dirname,'../views');

app.set('view engine', 'hbs');
app.set('views', directorioviews);
hbs.registerPartials(directoriopartials);
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialed: true
}))

/*     var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/uploads')
        },
        filename: function (req, file, cb) {
          cb(null, 'avatar'+ req.body.nombre + path.extname (file.originalname))
        }
      })
      var upload = multer({ storage: storage }) */
      var upload = multer({ 
          limits: {
              fileSize: 1000000
          },
           fileFilter (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
                return cb(new Error('No es un archivo valido'))
            }
           
            cb(null, true)
           
           
          }
         }) 

   
 
  app.get('/', (req,res) => {
    console.log(process.env.SENDGRID_API_KEY);
    let coordinador = new Estudiante({
        usuario: 'coordinador',
        nombre: 'Coordinador',
        password: bcrypt.hashSync('12345',10),
        documento: 0,
        correo: 'coordinador@g.com',
        telefono: '0',
        rol:'coordinador'
    })

    Estudiante.find({usuario: 'coordinador', rol:'coordinador'}).exec((err, encontrado)=> {
        if (err) {
            return console.log(err)
        }
        
        if (!encontrado || encontrado.length == 0) {
            
            coordinador.save((err, resultado)=> {
                if (err) {
                    return res.render('indexpost',{
                        titulo:'Inicio',
                        mensaje: "<div class='alert alert-danger' role='alert'>"+err+"</div>"
                    });
                }

                return res.render('index',{
                    titulo:'Inicio',
                    session: req.session.usuario,
                    nombre: req.session.nombre,
                    coordinador: req.session.rol=='coordinador',
                    aspirante: req.session.rol=='aspirante'
                });   
            });
        }
        
        res.render('index',{
            titulo:'Inicio',
            session: req.session.usuario,
            nombre: req.session.nombre,
            coordinador: req.session.rol=='coordinador',
            aspirante: req.session.rol=='aspirante'
        });  
    })
});


app.post('/', upload.single('archivo'), (req,res) => {
    let estudiante = new Estudiante({
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        password: bcrypt.hashSync(req.body.password,10),
        documento: req.body.documento,
        correo: req.body.correo,
        telefono: req.body.telefono,
        avatar: req.file.buffer
    })


      const msg = {
        to: req.body.correo,
        from: 'maricruzlista@gmail.com',
        subject: 'Bienvenido',
        text: 'Bienvenido a la página de Node.JS'
       };

    estudiante.save((err, resultado)=> {
        if (err) {
            return res.render('indexpost',{
                titulo:'Inicio',
                mensaje: "<div class='alert alert-danger' role='alert'>"+err+"</div>"
            });
        }
        sgMail.send(msg);

        res.render('indexpost',{
            titulo:'Inicio',
            mensaje: "<div class='alert alert-success' role='alert'>Registro exitoso</div>",
            session: true,
            nombre: req.session.nombre,
            coordinador: req.session.rol=='coordinador',
            aspirante: req.session.rol=='aspirante',
        });      
    });
});

app.post('/crear_resultado', (req,res) => {
	let curso = new Curso({
		id_curso: req.body.id_curso,
		nombre: req.body.nombre,
		valor: parseInt(req.body.valor),
		descripcion: req.body.descripcion,
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad
	})
	
	curso.save((err, resultado)=> {
        if (err) {
            return res.render('indexpost',{
                titulo:'Crear Curso',
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                mensaje: "<div class='alert alert-danger' role='alert'>"+err+"</div>"
            });
        }

        if (!resultado) {
            return  res.render('crear_resultado',{
                titulo:'Crear Curso',
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                mensaje: "<div class='alert alert-danger' role='alert'>No se pudo crear el curso</div>"
            });           
        }
        
		res.render('crear_resultado',{
            titulo:'Crear Curso',
			session: true,
			nombre: req.session.nombre,
			coordinador: req.session.rol=='coordinador',
			aspirante: req.session.rol=='aspirante',
			curso: {
				id_curso: resultado.id_curso,
				nombre: resultado.nombre,
				valor: parseInt(resultado.valor),
				descripcion: resultado.descripcion,
				modalidad: resultado.modalidad,
				intensidad: resultado.intensidad
            },
            mensaje: "<div class='alert alert-success' role='alert'>El curso "+ resultado.id_curso +"-"+ resultado.nombre+" fue creado satisfactoriamente</div>"
		});     
	});
	

});

app.get('/inscribir', (req,res) => {
    Curso.find({estado:'disponible'}).exec((err, resultado)=> {
        if (err) {
            return console.log(err)
        }
        
        res.render('inscribir',{
            titulo:'Inscribir Curso',
            session: true && req.session.nombre,
            nombre: req.session.nombre,
            documento: req.session.documento,
            correo: req.session.correo,
            telefono: req.session.telefono,
            coordinador: req.session.rol=='coordinador',
            aspirante: req.session.rol=='aspirante',
            rol: req.session.rol,
            existeCurso: resultado.length > 0,
            cursos: resultado
        });
    })


});

app.post('/inscribir', (req,res) => {

	let inscrito = new Inscrito({
		id_curso: req.body.id_curso,
        documento: req.body.documento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    })
    
    Inscrito.find({id_curso: req.body.id_curso, documento: req.body.documento}).exec((err, encontrado)=> {

        if (err) {
            return console.log(err)
        }
        
        if (!encontrado || encontrado.length == 0) {
      
            inscrito.save((err, resultadoSave)=> {

                if (err) {
                    return res.render('inscribir_resultado',{
                        titulo:'Inscribir Curso',
                        session: true,
                        nombre: req.session.nombre,
                        coordinador: req.session.rol=='coordinador',
                        aspirante: req.session.rol=='aspirante',
                        mensaje: "<div class='alert alert-danger' role='alert'>"+err+"</div>"
                    });
                }
        
                if (!resultadoSave) {
                    return  res.render('inscribir_resultado',{
                        titulo:'Inscribir Curso',
                        session: true,
                        nombre: req.session.nombre,
                        coordinador: req.session.rol=='coordinador',
                        aspirante: req.session.rol=='aspirante',
                        mensaje: "<div class='alert alert-danger' role='alert'>No se pudo realizar la inscripción</div>"
                    });           
                }
        
                Inscrito.find({id_curso: resultadoSave.id_curso}).exec((err, inscritos)=> {
        
                    if (err) {
                        return console.log(err)
                    }
        
                    res.render('inscribir_resultado',{
                        titulo:'Inscribir Curso',
                        session: true,
                        nombre: req.session.nombre,
                        coordinador: req.session.rol=='coordinador',
                        aspirante: req.session.rol=='aspirante',
                        documento: resultadoSave.documento,
                        id_curso: resultadoSave.id_curso,
                        inscritos_curso: inscritos,
                        mensaje: "<div class='alert alert-success' role='alert'>El estudiante "+ req.session.nombre + " fue inscrito en el curso "+ resultadoSave.id_curso +" satisfactoriamente</div>"
               
                    }); 
          
                })
            });
        }
        else {
            res.render('inscribir_resultado',{
                titulo:'Inscribir Curso',
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                documento: req.body.documento,
                id_curso: req.body.id_curso,
                mensaje: "<div class='alert alert-warning' role='alert'>El estudiante "+ req.session.nombre + "  ya se encuentra inscrito en el curso "+ req.body.id_curso +"</div>"
       
            });
        } 

    })
    
});

app.get('/listarCursos', (req,res) => {
    Curso.find({}).exec((err, resultado)=> {
        if (err) {
            return console.log(err)
        }
        
        res.render('listar_cursos',{
            titulo:'Listar Cursos',
            session: true && req.session.nombre,
            nombre: req.session.nombre,
            coordinador: req.session.rol=='coordinador',
            aspirante: req.session.rol=='aspirante',
            rol: req.session.rol,
            listado: resultado
        });   
    })
});

app.get('/listarInscritos', (req,res) => {
    Curso.find({}).exec((err, cursos)=> {
        if (err) {
            return console.log(err)
        }
        
        Inscrito.find({}).exec((err, inscritos)=> {
            if (err) {
                return console.log(err)
            }
            
            res.render('listar_inscritos',{
                titulo:'Ver Inscritos',
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                rol: req.session.rol,
                inscritos: inscritos,
                cursos: cursos,
                curso: null
            });   
        })
    })   

});

app.get('/actualizarCurso', (req,res) => {
    Curso.findOneAndUpdate({id_curso: req.query.id_curso}, {$set:{estado:'cerrado'}}, {new :  true}, (err, resultado)=> {
        if (err) {
            return console.log(err)
        }
        
        if (!resultado) {
            return res.render('listar_inscritos',{
                titulo:'Ver Inscritos',
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                rol: req.session.rol,
                inscritos: null,
                cursos: null,
                curso: req.query.id_curso,
                mensaje: "<div class='alert alert-danger' role='alert'>El curso "+ req.query.id_curso + " no se pudo cerrar</div>"
            }); 
        }

        Curso.find({}).exec((err, cursos)=> {
            if (err) {
                return console.log(err)
            }
            
            Inscrito.find({}).exec((err, inscritos)=> {
                if (err) {
                    return console.log(err)
                }
                
                res.render('listar_inscritos',{
                    titulo:'Ver Inscritos',
                    session: true,
                    nombre: req.session.nombre,
                    coordinador: req.session.rol=='coordinador',
                    aspirante: req.session.rol=='aspirante',
                    rol: req.session.rol,
                    inscritos: inscritos,
                    cursos: cursos,
                    curso: resultado.id_curso,
                    mensaje: "<div class='alert alert-success' role='alert'>El curso "+ resultado.id_curso + " fue cerrado satisfactoriamente</div>"
                });   
            })
        }) 
    
    });

});

app.get('/eliminar', (req,res) => {
    Inscrito.findOneAndDelete({documento: req.query.documento, id_curso: req.query.id_curso}, req.body, (err, resultado)=> {

        if (err) {
            return console.log(err)
        } 

        if (!resultado) {
            return  res.render('listar_inscritos_curso',{
                titulo: 'Ver Inscritos',
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                documento: req.query.documento,
                id_curso: req.query.id_curso,
                mensaje: "<div class='alert alert-danger' role='alert'>No se encontro el estudiante</div>"
            });           
        }    
        
        Inscrito.find({id_curso: resultado.id_curso}).exec((err, inscritos)=> {
            if (err) {
                return console.log(err)
            }
            
            res.render('listar_inscritos_curso',{
                titulo: 'Ver Inscritos',
                documento: req.query.documento,
                id_curso: req.query.id_curso,
                session: true,
                nombre: req.session.nombre,
                coordinador: req.session.rol=='coordinador',
                aspirante: req.session.rol=='aspirante',
                inscritos: inscritos,
                mensaje: "<div class='alert alert-success' role='alert'>El estudiante "+ resultado.documento +" fue eliminado satisfactoriamente del curso "+ resultado.id_curso +"</div>"
            });    
        })

 
    });
});

app.post('/ingresar', (req,res) => {
    Estudiante.findOne({usuario: req.body.usuario}, (err, resultado)=> {
        if (err) {
            return console.log(err)
        }
        
        if (!resultado) {
            return  res.render('ingresar',{
                titulo: 'Inicio',
                mensaje: "<div class='alert alert-danger' role='alert'>Datos incorrectos</div>"
            });   
        }
        
        if (!bcrypt.compareSync(req.body.password, resultado.password)) {
            return  res.render('ingresar',{
                titulo: 'Inicio',
                mensaje: "<div class='alert alert-danger' role='alert'>Datos incorrectos</div>"
            });   
        }

        req.session.usuario = resultado._id;
        req.session.nombre = resultado.nombre;
        req.session.documento = resultado.documento;
        req.session.correo = resultado.correo;
        req.session.telefono = resultado.telefono;
        req.session.rol = resultado.rol;
        avatar = resultado.avatar.toString('base64');
        res.render('ingresar',{
            titulo: 'Inicio',
            session: true,
            mensaje: " <h2>Bienvenido "+ resultado.nombre +" </h2>",
            nombre: req.session.nombre,
            coordinador: req.session.rol=='coordinador',
            aspirante: req.session.rol=='aspirante',
            rol: req.session.rol,
            avatar: avatar 
        });      
    
    });
});

app.get('/salir', (req,res) => {
    req.session.destroy((err)=> {
        if (err) {
            return console.log(err)
        }
        
        res.redirect('/');      
    })
});

app.get('/crearCurso', (req,res) => {
	res.render('crear_curso',{
		titulo:'Crear Curso',
		session: true,
		nombre: req.session.nombre,
		coordinador: req.session.rol=='coordinador',
		aspirante: req.session.rol=='aspirante'
	});
});

app.get('*', (req,res) => {
	res.render('error',{
		estudiante: 'error',
		session: true,
		nombre: req.session.nombre,
		coordinador: req.session.rol=='coordinador',
		aspirante: req.session.rol=='aspirante'
	});
});


module.exports = app