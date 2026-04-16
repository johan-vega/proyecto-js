<?php
session_start();
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

if (!isset($_SESSION['tipo'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No session']);
    exit;
}

if ($_SESSION['tipo'] === 'alumno') {
    $host = 'localhost';
    $db = 'BD_MATRICULA';
    $user = 'root';
    $pass = '';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT NOMBRES, APELLIDOS FROM ALUMNO WHERE ID_ALUMNO = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['id_alumno']]);
        $alumno = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$alumno) {
            http_response_code(401);
            echo json_encode(['error' => 'No session']);
            exit;
        }

        echo json_encode([
            'tipo' => 'alumno',
            'nombre' => $alumno['NOMBRES'] . ' ' . $alumno['APELLIDOS']
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error BD']);
        exit;
    }
}

echo json_encode([
    'tipo' => 'admin',
    'nombre' => 'Administracion'
]);
