$(document).ready(function () {
    cargarAulas();
});

function cargarAulas() {
    $.ajax({
        url: "php/crud_aulas.php",
        type: "POST",
        dataType: "json",
        data: { opcion: 4 }, // LISTAR AULAS
        success: function (data) {
            let tbody = $('#tablaAulas');
            tbody.empty();

            $.each(data, function (index, aula) {
                let fila = `<tr>
                    <td>${aula.ID_AULA}</td>
                    <td>${aula.NIVEL}</td>
                    <td>${aula.GRADO}</td>
                    <td>${aula.SECCION}</td>
                    <td>${aula.VACANTES_TOTALES}</td>
                    <td>${aula.VACANTES_DISPONIBLES}</td>
                </tr>`;
                tbody.append(fila);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar aulas:", error);
            Swal.fire('Error', 'No se pudieron cargar las aulas.', 'error');
        }
    });
}