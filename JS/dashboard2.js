/* ========================================================
1. NAVEGACIÓN DEL MENÚ LATERAL (SPA)
======================================================== */

// Variables globales para los gráficos
let chartGenero = null;
let chartNiveles = null;
$('.sidebar-nav li').on('click', function (e) {
    e.preventDefault();

    // Quitar 'active' de todos y ponérselo al actual
    $('.sidebar-nav li').removeClass('active');
    $(this).addClass('active');

    // Lógica para mostrar/ocultar módulos basada en el texto del menú
    let menuTexto = $(this).text().trim(); // Ej: "Dashboard" o "Estudiantes"
    if (menuTexto === 'Dashboard') {
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloMatricula').hide();
        $('#moduloPagos').hide();
        $('#moduloConfiguracion').hide();
        $('#moduloDashboard').fadeIn();
        cargarDatosDashboard(); // Función que crearemos abajo
    }
    else if (menuTexto === 'Estudiantes') {
        $('#moduloDashboard').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloMatricula').hide();
        $('#moduloPagos').hide();
        $('#moduloConfiguracion').hide();
        $('#moduloEstudiantes').fadeIn();
    }
    else if (menuTexto === 'Cursos') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloAulas').hide();
        $('#moduloMatricula').hide();
        $('#moduloPagos').hide();
        $('#moduloConfiguracion').hide();
        $('#moduloCursos').fadeIn();
    }
    else if (menuTexto === 'Aulas') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloMatricula').hide();
        $('#moduloPagos').hide();
        $('#moduloConfiguracion').hide();
        $('#moduloAulas').fadeIn();
    }
    else if (menuTexto === 'Matricula') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloPagos').hide();
        $('#moduloConfiguracion').hide();
        $('#moduloMatricula').fadeIn();
    }
    else if (menuTexto === 'Pagos') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloMatricula').hide();
        $('#moduloConfiguracion').hide();
        $('#moduloPagos').fadeIn();
    }
    else if (menuTexto === 'Configuración') {
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        $('#moduloCursos').hide();
        $('#moduloAulas').hide();
        $('#moduloMatricula').hide();
        $('#moduloPagos').hide();
        $('#moduloConfiguracion').fadeIn();
    }

    else {
        // Para menús aún no construidos (Cursos, Pagos, etc.)
        $('#moduloDashboard').hide();
        $('#moduloEstudiantes').hide();
        Swal.fire('Módulo en Desarrollo', 'Esta sección estará disponible pronto.', 'info');
    }

});

/* ========================================================
FUNCIÓN PARA CARGAR DATOS DEL DASHBOARD
======================================================== */
function cargarDatosDashboard() {
    $.ajax({
        url: "php/dashboard-datos.php",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.exito) {
                let datos = respuesta.datos;

                // Actualizar KPIs
                $('#kpiTotalAlumnos').text(datos.kpis.totalAlumnos);
                $('#kpiTotalAulas').text(datos.kpis.totalAulas);
                $('#kpiVacantesDisp').text(datos.kpis.vacantesDisp);

                // Preparar datos para gráfico de género
                let etiquetasGenero = [];
                let datosGenero = [];
                $.each(datos.graficos.genero, function (index, item) {
                    etiquetasGenero.push(item.GENERO);
                    datosGenero.push(item.cantidad);
                });

                // Preparar datos para gráfico de niveles
                let etiquetasNiveles = [];
                let totalesNiveles = [];
                let disponiblesNiveles = [];
                $.each(datos.graficos.niveles, function (index, item) {
                    etiquetasNiveles.push(item.NIVEL);
                    totalesNiveles.push(item.totales);
                    disponiblesNiveles.push(item.disponibles);
                });

                // Dibujar gráficos
                dibujarGraficoGenero(etiquetasGenero, datosGenero);
                dibujarGraficoNiveles(etiquetasNiveles, totalesNiveles, disponiblesNiveles);
            } else {
                console.log("Error al cargar datos del dashboard:", respuesta.mensaje);
                Swal.fire('Error', 'No se pudieron cargar los datos del dashboard.', 'error');
            }
        },
        error: function (xhr, status, error) {
            console.log("Error AJAX al cargar dashboard:", error);
            Swal.fire('Error', 'Error de conexión al cargar el dashboard.', 'error');
        }
    });
}

$(document).ready(function () {
    // 1. ABRIR MODAL PARA NUEVO REGISTRO
    $('.btn-primary').on('click', function () {
        $('#formAlumno')[0].reset(); // Limpiar formulario
        $('#opcion').val('1'); // Configurar acción: CREAR
        $('#modalTitulo').text('Registrar Nuevo Alumno');
        $('#password').attr('required', true); // Contraseña obligatoria al crear
        $('#modalAlumno').fadeIn();
    });
    // 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalAlumno').fadeOut();
    });
    // 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formAlumno').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(), // Empaqueta todos los 14 campos automáticamente
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAlumno').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload();
                    });

                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            },
            error: function (xhr, status, error) {
                Swal.fire('Error', 'Error en la solicitud', 'error');
            }
        });
    });
    // 4. ELIMINAR REGISTRO (Click en el basurero)
    $(document).on('click', '.fa-trash', function () {
        // Obtenemos la fila y buscamos el ID del alumno (que está en la primera columna < td >)
        let fila = $(this).closest('tr');
        let idAlumno = fila.find('td:eq(0)').text();
        Swal.fire({
            title: '¿Eliminar Alumno?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_alumnos.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_alumno: idAlumno }, // Enviamos opción 3(Eliminar) y el ID
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });
    // 5. EDITAR REGISTRO (Botón de Lápiz - Solo lógica inicial)
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idAlumno = fila.find('td:eq(0)').text();
        let nombres = fila.find('td:eq(1)').text(); // Ajustar según las columnas de tu HTML
        let apellidos = fila.find('td:eq(2)').text();
        // Cargar datos al formulario
        $('#id_alumno').val(idAlumno);
        $('#opcion').val('2'); // Configurar acción: EDITAR
        $('#modalTitulo').text('Editar Alumno');
        $('#password').removeAttr('required'); // Contraseña opcional al editar
        // PISTA: Para un proyecto completo, aquí debes llenar el resto de los $('#campo').val()
        $('#nombres').val(nombres);
        $('#apellidos').val(apellidos);
        $('#modalAlumno').fadeIn();
    });

    /* ========================================================
    FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
    ======================================================== */
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 }, // Le pedimos a PHP que ejecute el case 4

            success: function (data) {
                let tbody = $('#tablaAlumnos');
                tbody.empty(); // Limpiamos la tabla por si había algo antes
                // Usamos un bucle para recorrer cada alumno que llego desde la Base de Datos
                $.each(data, function (index, alumno) {
                    // Construimos la fila (tr) inyectando las variables de la base de datos
                    let estado = (alumno.ESTADO || 'ACTIVO').toString().trim().toUpperCase();
                    let estadoClass = 'status-active';

                    if (estado === 'INACTIVO') {
                        estadoClass = 'status-inactive';
                    } else if (estado === 'EN PROCESO' || estado === 'PROCESO') {
                        estadoClass = 'status-pending';
                    }

                    let fila = `
                        <tr>
                        <td>${alumno.ID_ALUMNO}</td>
                        <td>${alumno.NOMBRES}</td>
                        <td>${alumno.APELLIDOS}</td>
                        <td>${alumno.DNI_ALUMNO}</td>
                        <td>${alumno.FECHA_NACIMIENTO}</td>
                        <td>${alumno.CELULAR}</td>
                        <td>${alumno.CORREO}</td>
                
                        <td><span class="status-badge ${estadoClass}"> ${estado} </span></td>
                        <td class="action-icons">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <i class="fa-solid fa-eye"></i>
                        <i class="fa-solid fa-trash"></i>
                        </td>
                        </tr>
                        `;
                    // Agregamos la fila recién creada a nuestra tabla
                    tbody.append(fila);
                });
            },
            error: function () {
                console.log("Error al cargar los datos de la tabla.");
            }
        });
    }
    // ¡MUY IMPORTANTE! Ejecutar la función apenas cargue la página
    cargarAlumnos();
});
// --- FUNCIONES AUXILIARES PARA DIBUJAR ---
function dibujarGraficoGenero(etiquetas, datos) {
    let ctx = document.getElementById('graficoGenero').getContext('2d');
    // Destruir gráfico anterior si existe (evita superposición al cambiar de pestaña)
    if (chartGenero) { chartGenero.destroy(); }
    chartGenero = new Chart(ctx, {
        type: 'doughnut', // Gráfico circular tipo "Dona"
        data: {
            labels: etiquetas,
            datasets: [{
                data: datos,
                backgroundColor: ['#3498DB', '#E74C3C', '#F1C40F'],

                // Colores corporativos

                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que se adapte a nuestro CSS

            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
function dibujarGraficoNiveles(etiquetas, totales, disponibles) {
    let ctx =
        document.getElementById('graficoNiveles').getContext('2d');
    if (chartNiveles) { chartNiveles.destroy(); }
    chartNiveles = new Chart(ctx, {
        type: 'bar', // Gráfico de barras
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Vacantes Totales',
                    data: totales,
                    backgroundColor: '#95A5A6', // Gris
                    borderRadius: 4
                },
                {
                    label: 'Vacantes Disponibles',
                    data: disponibles,
                    backgroundColor: '#2ECC71', // Verde
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// funcion para el modulo de CURSOS
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

//  FUNCION PARA MODULO DE AULAS

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



// Función para cerrar sesión
function cerrarSesion() {
    $.ajax({
        url: "php/login.php",
        type: "POST",
        data: { action: 'logout' },
        success: function (response) {
            window.location.href = "login.html";
        },
        error: function () {
            alert("Error al cerrar sesión");
        }
    });
}
// FUNCIONES PARA MODULO MATRICULA
function cargarAlumnosMatricula() {
    $.ajax({
        url: "php/crud_alumnos.php",
        type: "POST",
        dataType: "json",
        data: { opcion: 4 },
        success: function (data) {
            let select = $('#alumnoMatricula');
            select.empty();
            select.append('<option value="">Seleccione Alumno...</option>');
            $.each(data, function (index, alumno) {
                select.append(`<option value="${alumno.ID_ALUMNO}">${alumno.NOMBRES} ${alumno.APELLIDOS}</option>`);
            });
        }
    });
}

function cargarAulasMatricula() {
    $.ajax({
        url: "php/api_matricula.php?aulas=1",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = $('#aulaMatricula');
            select.empty();
            select.append('<option value="">Seleccione Aula...</option>');
            $.each(data, function (index, aula) {
                select.append(`<option value="${aula.ID_AULA}">${aula.NIVEL} ${aula.GRADO} ${aula.SECCION} (Disp: ${aula.VACANTES_DISPONIBLES})</option>`);
            });
        }
    });
}

$('#alumnoMatricula').change(function () {
    let idAlumno = $(this).val();
    if (idAlumno) {
        $.ajax({
            url: `php/api_matricula.php?id_alumno=${idAlumno}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                let select = $('#cursoMatricula');
                select.empty();
                select.append('<option value="">Seleccione Curso...</option>');
                $.each(data, function (index, curso) {
                    select.append(`<option value="${curso.ID_INSCRIPCION}" data-curso="${curso.ID_CURSO}">${curso.NOM_CURSO}</option>`);
                });
            }
        });
    }
});

$('#btnMatricular').click(function () {
    let idAlumno = $('#alumnoMatricula').val();
    let idCurso = $('#cursoMatricula option:selected').data('curso');
    let idAula = $('#aulaMatricula').val();

    if (!idAlumno || !idCurso || !idAula) {
        Swal.fire('Error', 'Seleccione todos los campos', 'error');
        return;
    }

    $.ajax({
        url: "php/api_matricula.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id_alumno: idAlumno, id_curso: idCurso, id_aula: idAula }),
        success: function (response) {
            Swal.fire('Éxito', response.mensaje, 'success');
            $('#formMatricula')[0].reset();
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
            Swal.fire('Error', 'Error al matricular', 'error');
        }
    });
});

// FUNCIONES PARA MODULO PAGOS
$('#btnBuscarPago').click(function () {
    let busqueda = $('#buscarAlumnoPago').val();
    if (busqueda) {
        $.ajax({
            url: `php/api_pagos.php?buscar=${busqueda}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                let html = '';
                if (data.length > 0) {
                    $.each(data, function (index, alumno) {
                        html += `<div class="alumno-pago">
                            <h4>${alumno.NOMBRES} ${alumno.APELLIDOS} (DNI: ${alumno.DNI_ALUMNO})</h4>
                            <p>Matrículas: ${alumno.matriculas.length}</p>
                            <button class="btn btn-primary procesar-pago" data-id="${alumno.ID_ALUMNO}" data-nombre="${alumno.NOMBRES} ${alumno.APELLIDOS}">Procesar Pago</button>
                        </div>`;
                    });
                } else {
                    html = '<p>No se encontraron alumnos con esa búsqueda.</p>';
                }
                $('#resultadoBusqueda').html(html);
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
                Swal.fire('Error', 'Error al buscar alumnos', 'error');
            }
        });
    } else {
        Swal.fire('Advertencia', 'Ingrese un nombre o DNI para buscar', 'warning');
    }
});

$(document).on('click', '.procesar-pago', function () {
    let idAlumno = $(this).data('id');
    let nombre = $(this).data('nombre');

    $.ajax({
        url: "php/api_pagos.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id_alumno: idAlumno, nombre_alumno: nombre, estado: 'ACTIVO' }),
        success: function (response) {
            Swal.fire('Éxito', `Pago procesado. Monto: S/${response.monto}. Código: ${response.cod_pago}`, 'success');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
            Swal.fire('Error', 'Error al procesar pago', 'error');
        }
    });
});

// FUNCION PARA CARGAR INFO DE USUARIO
function cargarInfoUsuario() {
    $.ajax({
        url: "php/api_usuario.php", // Asumiendo que hay un script para obtener sesión
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.tipo === 'alumno') {
                $('.user-info h3').text(data.nombre);
                $('.user-dropdown h3').text(data.nombre + ' (Alumno)');
            } else {
                $('.user-info h3').text('Administración');
                $('.user-dropdown h3').text('Administración');
            }
        }
    });
}

// Llamar al cargar la página
$(document).ready(function () {
    cargarInfoUsuario();
    cargarAlumnosMatricula();
    cargarAulasMatricula();
});