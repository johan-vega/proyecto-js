<?php
header("Access-Control-Allow-Origin: *");
header("content-type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$host = 'localhost';
$db = 'BD_MATRICULA';
$user = 'root';
$pass = '';
try {
    $pdo = new PDO("mysql:host=$host; dbname=$db; charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de conexion a la Base de Datos"]);
    exit();
}

$metodoHTTP = $_SERVER['REQUEST_METHOD'];

switch ($metodoHTTP) {
    case 'GET':
        if (isset($_GET['id_alumno'])) {
            // Obtener cursos inscritos por alumno
            $sql = "SELECT ic.ID_INSCRIPCION, c.ID_CURSO, c.CODIGO_CURSO, c.NOM_CURSO, c.CREDITO, ic.FECHA_INSCRIPCION, ic.ESTADO
                    FROM INSCRIPCION_CURSO ic
                    JOIN CURSO c ON ic.ID_CURSO = c.ID_CURSO
                    WHERE ic.ID_ALUMNO = :id_alumno";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id_alumno' => $_GET['id_alumno']]);
            $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($cursos);
        } elseif (isset($_GET['aulas'])) {
            // Obtener aulas disponibles
            $sql = "SELECT * FROM AULA WHERE VACANTES_DISPONIBLES > 0";
            $stmt = $pdo->query($sql);
            $aulas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($aulas);
        } else {
            // Obtener todas las matriculas
            $sql = "SELECT * FROM MATRICULA ORDER BY FECHA_MATRICULA DESC";
            $stmt = $pdo->query($sql);
            $matriculas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($matriculas);
        }
        break;
    case 'POST':
        $datos = json_decode(file_get_contents("php://input"), true);
        if (isset($datos['id_alumno']) && isset($datos['id_curso']) && isset($datos['id_aula'])) {
            // Insertar matricula
            $sql = "INSERT INTO MATRICULA (NOMBRE_CURSO, NOMBRE_ALUMNO, FECHA_MATRICULA) 
                    SELECT c.NOM_CURSO, CONCAT(a.NOMBRES, ' ', a.APELLIDOS), NOW()
                    FROM CURSO c, ALUMNO a
                    WHERE c.ID_CURSO = :id_curso AND a.ID_ALUMNO = :id_alumno";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id_curso' => $datos['id_curso'], 'id_alumno' => $datos['id_alumno']]);

            // Actualizar vacantes disponibles en aula
            $sql_update = "UPDATE AULA SET VACANTES_DISPONIBLES = VACANTES_DISPONIBLES - 1 WHERE ID_AULA = :id_aula AND VACANTES_DISPONIBLES > 0";
            $stmt_update = $pdo->prepare($sql_update);
            $stmt_update->execute(['id_aula' => $datos['id_aula']]);

            echo json_encode(["exito" => true, "mensaje" => "Matrícula registrada correctamente"]);
        } else {
            echo json_encode(["exito" => false, "mensaje" => "Datos incompletos"]);
        }
        break;
    default:
        echo json_encode(["mensaje" => "Método no soportado"]);
        break;
}
