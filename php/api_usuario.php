<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['tipo'])) {
    if ($_SESSION['tipo'] == 'alumno') {
        // Obtener nombre del alumno
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

            echo json_encode([
                'tipo' => 'alumno',
                'nombre' => $alumno['NOMBRES'] . ' ' . $alumno['APELLIDOS']
            ]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error BD']);
        }
    } else {
        echo json_encode([
            'tipo' => 'admin',
            'nombre' => 'Administración'
        ]);
    }
} else {
    echo json_encode(['error' => 'No session']);
}
