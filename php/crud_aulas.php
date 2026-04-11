<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'BD_MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $opcion = $_POST['opcion'] ?? '';

    switch ($opcion) {
        case '4': // LISTAR TODAS LAS AULAS
            $sql = "SELECT ID_AULA, NIVEL, GRADO, SECCION, VACANTES_TOTALES, VACANTES_DISPONIBLES FROM AULA ORDER BY ID_AULA";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $aulas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($aulas);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
