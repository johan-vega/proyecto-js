<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

$host = 'localhost';
$db = 'bd_matricula';
$user = 'root';
$pass = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'logout') {
    session_start();
    $_SESSION = array();

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
    echo json_encode(['exito' => true, 'mensaje' => 'Sesion cerrada']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $usuarioIngresado = $_POST['user'] ?? '';
    $passwordIngresada = $_POST['pass'] ?? '';

    $sqlAdmin = "SELECT id, password_hash FROM usuario WHERE username = :usuario LIMIT 1";
    $stmtAdmin = $pdo->prepare($sqlAdmin);
    $stmtAdmin->bindParam(':usuario', $usuarioIngresado);
    $stmtAdmin->execute();
    $usuarioFila = $stmtAdmin->fetch(PDO::FETCH_ASSOC);

    if ($usuarioFila && password_verify($passwordIngresada, $usuarioFila['password_hash'])) {
        session_start();
        session_regenerate_id(true);
        $_SESSION['usuario_id'] = $usuarioFila['id'];
        $_SESSION['tipo'] = 'admin';

        echo json_encode([
            'exito' => true,
            'mensaje' => 'Login correcto como administrador'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sqlAlumno = "SELECT ID_ALUMNO, PASSWORD_HASH FROM ALUMNO WHERE USERNAME = :usuario AND ESTADO = 'ACTIVO' LIMIT 1";
    $stmtAlumno = $pdo->prepare($sqlAlumno);
    $stmtAlumno->bindParam(':usuario', $usuarioIngresado);
    $stmtAlumno->execute();
    $alumnoFila = $stmtAlumno->fetch(PDO::FETCH_ASSOC);

    if ($alumnoFila && password_verify($passwordIngresada, $alumnoFila['PASSWORD_HASH'])) {
        session_start();
        session_regenerate_id(true);
        $_SESSION['id_alumno'] = $alumnoFila['ID_ALUMNO'];
        $_SESSION['tipo'] = 'alumno';

        echo json_encode([
            'exito' => true,
            'mensaje' => 'Login correcto como alumno'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'exito' => false,
        'mensaje' => 'Usuario o contrasena incorrectos.'
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error de conexion a la BD.'
    ], JSON_UNESCAPED_UNICODE);
}
