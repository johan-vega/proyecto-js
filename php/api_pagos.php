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
        if (isset($_GET['buscar'])) {
            $busqueda = $_GET['buscar'];
            // Buscar alumno por nombre o DNI
            $sql = "SELECT ID_ALUMNO, NOMBRES, APELLIDOS, DNI_ALUMNO FROM ALUMNO 
                    WHERE CONCAT(NOMBRES, ' ', APELLIDOS) LIKE :busqueda OR DNI_ALUMNO LIKE :busqueda";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['busqueda' => '%' . $busqueda . '%']);
            $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Para cada alumno, obtener sus matriculas
            foreach ($alumnos as &$alumno) {
                $sql_mat = "SELECT * FROM MATRICULA WHERE NOMBRE_ALUMNO LIKE :nombre";
                $stmt_mat = $pdo->prepare($sql_mat);
                $stmt_mat->execute(['nombre' => '%' . $alumno['NOMBRES'] . ' ' . $alumno['APELLIDOS'] . '%']);
                $alumno['matriculas'] = $stmt_mat->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode($alumnos);
        } else {
            // Obtener todas las reservas/pagos
            $sql = "SELECT * FROM RESERVA ORDER BY FECHA_RESERVA DESC";
            $stmt = $pdo->query($sql);
            $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($pagos);
        }
        break;
    case 'POST':
        $datos = json_decode(file_get_contents("php://input"), true);
        if (isset($datos['id_alumno']) && isset($datos['estado'])) {
            // Generar monto (ejemplo: 100 por curso matriculado)
            $sql_count = "SELECT COUNT(*) as total FROM MATRICULA WHERE NOMBRE_ALUMNO LIKE :nombre";
            $stmt_count = $pdo->prepare($sql_count);
            $stmt_count->execute(['nombre' => '%' . $datos['nombre_alumno'] . '%']);
            $count = $stmt_count->fetch(PDO::FETCH_ASSOC)['total'];
            $monto = $count * 100; // 100 soles por curso

            // Insertar o actualizar en RESERVA
            $sql = "INSERT INTO RESERVA (ID_ALUMNO, COD_PAGO, ESTADO_PAGO) 
                    VALUES (:id_alumno, :cod_pago, :estado)
                    ON DUPLICATE KEY UPDATE ESTADO_PAGO = :estado";
            $stmt = $pdo->prepare($sql);
            $cod_pago = 'PAGO' . time();
            $stmt->execute([
                'id_alumno' => $datos['id_alumno'],
                'cod_pago' => $cod_pago,
                'estado' => $datos['estado']
            ]);

            echo json_encode(["exito" => true, "mensaje" => "Pago procesado", "monto" => $monto, "cod_pago" => $cod_pago]);
        } else {
            echo json_encode(["exito" => false, "mensaje" => "Datos incompletos"]);
        }
        break;
    default:
        echo json_encode(["mensaje" => "Método no soportado"]);
        break;
}
