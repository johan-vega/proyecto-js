<?php
header('Content-Type: application/json');
session_start();

$host = 'localhost';
$db = 'BD_MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $opcion = $_POST['opcion'] ?? '';

    switch ($opcion) {
        case '4': // LISTAR TODOS LOS CURSOS
            $sql = "SELECT ID_CURSO, CODIGO_CURSO, NOM_CURSO, CREDITO FROM CURSO ORDER BY ID_CURSO";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($cursos);
            break;

        case '6': // INSCRIBIR ALUMNO A CURSO
            // Verificar que el alumno esté logueado
            if (!isset($_SESSION['id_alumno'])) {
                echo json_encode(["exito" => false, "mensaje" => "Debe iniciar sesión como alumno."]);
                break;
            }

            $id_alumno = $_SESSION['id_alumno'];
            $id_curso = $_POST['id_curso'];

            // Verificar que no esté ya inscrito
            $sql_check = "SELECT COUNT(*) FROM INSCRIPCION_CURSO WHERE ID_ALUMNO = ? AND ID_CURSO = ?";
            $stmt_check = $pdo->prepare($sql_check);
            $stmt_check->execute([$id_alumno, $id_curso]);
            $count = $stmt_check->fetchColumn();

            if ($count > 0) {
                echo json_encode(["exito" => false, "mensaje" => "Ya está inscrito en este curso."]);
                break;
            }

            // Insertar inscripción
            $sql = "INSERT INTO INSCRIPCION_CURSO (ID_ALUMNO, ID_CURSO) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_alumno, $id_curso]);
            echo json_encode(["exito" => true, "mensaje" => "Inscripción realizada correctamente."]);
            break;

        case '7': // LISTAR CURSOS INSCRITOS POR ALUMNO
            if (!isset($_SESSION['id_alumno'])) {
                echo json_encode([]);
                break;
            }

            $id_alumno = $_SESSION['id_alumno'];
            $sql = "SELECT c.ID_CURSO, c.CODIGO_CURSO, c.NOM_CURSO, c.CREDITO, ic.FECHA_INSCRIPCION, ic.ESTADO
                    FROM CURSO c
                    INNER JOIN INSCRIPCION_CURSO ic ON c.ID_CURSO = ic.ID_CURSO
                    WHERE ic.ID_ALUMNO = ?
                    ORDER BY ic.FECHA_INSCRIPCION DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_alumno]);
            $cursos_inscritos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($cursos_inscritos);
            break;

        case '8': // ELIMINAR INSCRIPCION DE CURSO
            if (!isset($_SESSION['id_alumno'])) {
                echo json_encode(["exito" => false, "mensaje" => "Debe iniciar sesión como alumno."]);
                break;
            }

            $id_alumno = $_SESSION['id_alumno'];
            $id_curso = $_POST['id_curso'];

            // Verificar que esté inscrito
            $sql_check = "SELECT COUNT(*) FROM INSCRIPCION_CURSO WHERE ID_ALUMNO = ? AND ID_CURSO = ?";
            $stmt_check = $pdo->prepare($sql_check);
            $stmt_check->execute([$id_alumno, $id_curso]);
            $count = $stmt_check->fetchColumn();

            if ($count == 0) {
                echo json_encode(["exito" => false, "mensaje" => "No está inscrito en este curso."]);
                break;
            }

            // Eliminar inscripción
            $sql = "DELETE FROM INSCRIPCION_CURSO WHERE ID_ALUMNO = ? AND ID_CURSO = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_alumno, $id_curso]);
            echo json_encode(["exito" => true, "mensaje" => "Inscripción eliminada correctamente."]);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
