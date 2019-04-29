const fs = require('fs');

const listarEstInscritos = (listaEstInscritos) => {
	let texto = '';

	if (listaEstInscritos != null && Object.keys(listaEstInscritos).length != 0) {

		texto = texto + "<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>Documento</th>"+
		"<th>Nombre</th>"+
		"<th>Correo</th>"+
		"<th>Telefono</th>"+
		"<th>Eliminar</th>"+
		"</thead>"+
		"<tbody>";

		listaEstInscritos.forEach(inscrito => {
				texto = texto + 
				'<tr>'+
				'<td>'+ inscrito.documento + '</td>' +
				'<td>'+ inscrito.nombre + '</td>' +
				'<td>'+ inscrito.correo + '</td>' +
				'<td>'+ inscrito.telefono + '</td>'+
				"<td><a href='/eliminar?documento="+ inscrito.documento +"&id_curso="+ inscrito.id_curso +"' class='btn btn-danger' role='button' aria-pressed='true'>Eliminar</a></td>"+
				'</tr>';
		
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay inscritos</div>";
	}
	return texto;
};

module.exports = {
	listarEstInscritos
}