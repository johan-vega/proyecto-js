$(document).ready(function () {
    cargarCursos();
});

function cargarCursos() {
    $.ajax({
        url: "php/crud_cursos.php",
        type: "POST",
        dataType: "json",
        data: { opcion: 4 }, // LISTAR CURSOS
        success: function (data) {
            let tbody = $('#tablaCursos');
            tbody.empty();

            // También cargar cursos inscritos para marcar
            $.ajax({
                url: "php/crud_cursos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 7 }, // CURSOS INSCRITOS
                success: function (inscritos) {
                    let inscritosIds = inscritos.map(c => c.ID_CURSO);

                    $.each(data, function (index, curso) {
                        let estaInscrito = inscritosIds.includes(curso.ID_CURSO);
                        let boton = estaInscrito ?
                            '<button class="btn btn-danger btn-sm eliminar" data-id="' + curso.ID_CURSO + '">Eliminar</button>' :
                            '<button class="btn btn-primary btn-sm inscribir" data-id="' + curso.ID_CURSO + '">Inscribirse</button>';

                        let fila = `<tr>
                            <td>${curso.CODIGO_CURSO}</td>
                            <td>${curso.NOM_CURSO}</td>
                            <td>${curso.CREDITO}</td>
                            <td>${boton}</td>
                        </tr>`;
                        tbody.append(fila);
                    });
                },
                error: function () {
                    // Si no hay sesión, mostrar todos sin marcar
                    $.each(data, function (index, curso) {
                        let fila = `<tr>
                            <td>${curso.CODIGO_CURSO}</td>
                            <td>${curso.NOM_CURSO}</td>
                            <td>${curso.CREDITO}</td>
                            <td><button class="btn btn-primary btn-sm inscribir" data-id="${curso.ID_CURSO}">Inscribirse</button></td>
                        </tr>`;
                        tbody.append(fila);
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar cursos:", error);
            Swal.fire('Error', 'No se pudieron cargar los cursos.', 'error');
        }
    });
}

// Evento para inscribirse
$(document).on('click', '.inscribir', function () {
    let idCurso = $(this).data('id');
    let fila = $(this).closest('tr');
    let nombreCurso = fila.find('td:eq(1)').text();

    Swal.fire({
        title: '¿Inscribirse al curso?',
        text: `¿Desea inscribirse en ${nombreCurso}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, inscribirme',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "php/crud_cursos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 6, id_curso: idCurso }, // INSCRIBIR
                success: function (respuesta) {
                    if (respuesta.exito) {
                        Swal.fire('¡Éxito!', respuesta.mensaje, 'success')
                            .then(() => cargarCursos()); // Recargar tabla
                    } else {
                        Swal.fire('Error', respuesta.mensaje, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al inscribir:", error);
                    Swal.fire('Error', 'No se pudo realizar la inscripción.', 'error');
                }
            });
        }
    });
});

// Evento para eliminar inscripción
$(document).on('click', '.eliminar', function () {
    let idCurso = $(this).data('id');
    let fila = $(this).closest('tr');
    let nombreCurso = fila.find('td:eq(1)').text();

    Swal.fire({
        title: '¿Eliminar inscripción?',
        text: `¿Desea eliminar su inscripción en ${nombreCurso}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "php/crud_cursos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 8, id_curso: idCurso }, // ELIMINAR INSCRIPCION
                success: function (respuesta) {
                    if (respuesta.exito) {
                        Swal.fire('¡Eliminado!', respuesta.mensaje, 'success')
                            .then(() => cargarCursos()); // Recargar tabla
                    } else {
                        Swal.fire('Error', respuesta.mensaje, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error al eliminar:", error);
                    Swal.fire('Error', 'No se pudo eliminar la inscripción.', 'error');
                }
            });
        }
    });
});