const hbs = require('hbs');
const funciones = require ('./funciones');

hbs.registerHelper('crearCurso', (curso) => {
	return funciones.crearCurso(curso);
});

hbs.registerHelper('listarCursos', (listaCursos, rol) => {

	let texto = "";

	if (listaCursos != null && Object.keys(listaCursos).length != 0) {

		texto = texto + "<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>ID</th>"+
		"<th>Nombre</th>"+
		"<th>Valor</th>"+
		"<th>Descripcion</th>"+
		"<th>Modalidad</th>"+
		"<th>Intensidad</th>"+
		"<th>Estado</th>"+
		"</thead>"+
		"<tbody>";

		listaCursos.forEach(curso => {
			if (curso.estado == 'disponible' || (rol == 'coordinador' && curso.estado == 'cerrado')) {
				texto = texto + 
				'<tr>'+
				'<td>'+ curso.id_curso + '</td>' +
				'<td>'+ curso.nombre + '</td>' +
				'<td>'+ curso.valor + '</td>' +
				'<td>'+ curso.descripcion + '</td>'+
				'<td>'+ (curso.modalidad==null?'-':curso.modalidad) + '</td>'+
				'<td>'+ (curso.intensidad==null?'-':curso.intensidad) + '</td>'+
				'<td>'+ curso.estado + '</td>'+
				'</tr>';
			}

			
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay cursos</div>";
	}

	return texto;
});

hbs.registerHelper('inscribirCurso', (estudiante) => {
	return funciones.inscribirCurso(estudiante);
});

hbs.registerHelper('listarInscritosCurso', (curso, listaInscritos) => {
	
	let texto = 'Curso: '+curso;

	let inscritos = (listaInscritos!=null&&listaInscritos.length != 0)?listaInscritos.filter(est => est.id_curso == curso):null;

	if (inscritos != null && Object.keys(inscritos).length != 0) {

		texto = texto + "<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>Documento</th>"+
		"<th>Nombre</th>"+
		"<th>Correo</th>"+
		"<th>Telefono</th>"+
		"</thead>"+
		"<tbody>";

		inscritos.forEach(inscrito => {
				texto = texto + 
				'<tr>'+
				'<td>'+ inscrito.documento + '</td>' +
				'<td>'+ inscrito.nombre + '</td>' +
				'<td>'+ inscrito.correo + '</td>' +
				'<td>'+ inscrito.telefono + '</td>'+
				'</tr>';
		
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay estudiantes inscritos en este curso</div>"
	}
	return texto;
});

hbs.registerHelper('listarEstInscritos', (listaInscritos, listaCursos) => {

	let texto = '';

	if (listaCursos != null && Object.keys(listaCursos).length != 0) {
		if (listaInscritos != null && Object.keys(listaInscritos).length != 0) {

			texto = texto + "<div class='accordion' id='accordionExample'>";
			i = 1;   
			listaCursos.forEach(curso => {
				if (curso.estado == 'disponible') {
					let inscritos = listaInscritos.filter(est => est.id_curso == curso.id_curso);
					if (inscritos != null && Object.keys(inscritos).length != 0) {
						texto = texto + 
						`<div class="card">
						<div class="card-header" id="heading${i}">
						<h2 class="text-center">
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
							<h5>
							Curso: ${curso.id_curso}-${curso.nombre}
							</h5>
							</button>
							<a href='/actualizarCurso?id_curso=${curso.id_curso}' class='btn btn-danger' role='button' aria-pressed='true'>Cerrar Curso</a></td>

						</h2>
						<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
						<div class="card-body">
						<h6 class="text-center">Estudiantes Inscritos</h6>`
					
						texto = texto + funciones.listarEstInscritos(inscritos);
						texto = texto + 
							`</div>
							</div>
						</div>`
					}
				}
				
				i = i + 1;
			
			});
			texto = texto + "</div>";
		}
		else {
			texto = "<div class='alert alert-warning' role='alert'>No hay estudiantes inscritos en los cursos</div>";
		}
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay cursos disponibles</div>";
	}
	return texto;
});

hbs.registerHelper('selectCursos', (listaCursos) => {

	let texto = '';

	if (listaCursos != null && Object.keys(listaCursos).length != 0) {
		texto = texto + "<select class='form-control'  name='id_curso' required>";

		listaCursos.forEach(curso => {
			if (curso.estado == 'disponible') {
			texto = texto + 
				"<option value='"+curso.id_curso+"'>"+curso.nombre+"-"+curso.id_curso+"</option>";
			}
		});
		texto = texto + "</select>";
	}
	return texto;
});

hbs.registerHelper('eliminarInscrito', (inscritos, curso) => {

	let texto = "";

	if (inscritos != null && Object.keys(inscritos).length != 0) {

		texto = texto + "Curso: "+ curso +"<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>Documento</th>"+
		"<th>Nombre</th>"+
		"<th>Correo</th>"+
		"<th>Telefono</th>"+
		"</thead>"+
		"<tbody>";

		inscritos.forEach(inscrito => {
				texto = texto + 
				'<tr>'+
				'<td>'+ inscrito.documento + '</td>' +
				'<td>'+ inscrito.nombre + '</td>' +
				'<td>'+ inscrito.correo + '</td>' +
				'<td>'+ inscrito.telefono + '</td>'+
				'</tr>';
		
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = texto + "<div class='alert alert-warning' role='alert'>No hay inscritos en el curso"+curso+"</div>"
	}
	
	return texto;
 
});

hbs.registerHelper('actualizarCurso', (curso) => {
	if (curso != null) {
		return funciones.actualizarCurso(curso);
	}
});

hbs.registerHelper('mostrar', (listado) => {
	let texto = "<form action='/eliminar' method='post'>"+
	"<table class='table table-striped'>"+ 
	"<thead class='thead-dark'>"+
	"<th>Nombre</th>"+
	"<th>Matematicas</th>"+
	"<th>Ingles</th>"+
	"<th>Programacion</th>"+
	"<th>Eliminar</th>"+
	"</thead>"+
	"<tbody>";


	listado.forEach(estudiante => {
		texto = texto + 
		'<tr>'+
		'<td>'+ estudiante.nombre + '</td>' +
		'<td>'+ estudiante.matematicas + '</td>' +
		'<td>'+ estudiante.ingles + '</td>' +
		'<td>'+ estudiante.programacion + '</td>'+
		'<td><button class="btn btn-danger" name="nombre" value="'+ estudiante.nombre + '">Eliminar</button></td>'+
		'</tr>';

		
	});
	texto = texto + "</tbody> </table> </form>";
	return texto;
});