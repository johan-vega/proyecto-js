<?php
// Indicar que la respuesta será en formato JSON
header('Content-Type: application/json');

// Credenciales de la Base de Datos
$host = 'localhost';
$db   = 'bd_matricula';
$user = 'root';
$pass = ''; // Cambiar si tu MySQL tiene contraseña

// Manejar logout
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'logout') {
    session_start();
    // Limpiar todas las variables de sesión
    $_SESSION = array();
    // Destruir la cookie de sesión
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
    echo json_encode(['exito' => true, 'mensaje' => 'Sesión cerrada']);
    exit;
}

try {
    // Conexión segura usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir los datos del POST (enviados por AJAX)
    $usuarioIngresado = $_POST['user'] ?? '';
    $passwordIngresada = $_POST['pass'] ?? '';

    // Primero buscar en USUARIO (admin)
    $sql_admin = "SELECT id, password_hash FROM usuario WHERE username = :usuario LIMIT 1";
    $stmt_admin = $pdo->prepare($sql_admin);
    $stmt_admin->bindParam(':usuario', $usuarioIngresado);
    $stmt_admin->execute();
    $usuarioFila = $stmt_admin->fetch(PDO::FETCH_ASSOC);

    if ($usuarioFila && password_verify($passwordIngresada, $usuarioFila['password_hash'])) {
        // Login como admin
        session_start();
        $_SESSION['usuario_id'] = $usuarioFila['id'];
        $_SESSION['tipo'] = 'admin';

        echo json_encode([
            "exito" => true,
            "mensaje" => "Login correcto como administrador"
        ], JSON_UNESCAPED_UNICODE);
    } else {
        // Buscar en ALUMNO
        $sql_alumno = "SELECT ID_ALUMNO, PASSWORD_HASH FROM ALUMNO WHERE USERNAME = :usuario AND ESTADO = 'ACTIVO' LIMIT 1";
        $stmt_alumno = $pdo->prepare($sql_alumno);
        $stmt_alumno->bindParam(':usuario', $usuarioIngresado);
        $stmt_alumno->execute();
        $alumnoFila = $stmt_alumno->fetch(PDO::FETCH_ASSOC);

        if ($alumnoFila && password_verify($passwordIngresada, $alumnoFila['PASSWORD_HASH'])) {
            // Login como alumno
            session_start();
            $_SESSION['id_alumno'] = $alumnoFila['ID_ALUMNO'];
            $_SESSION['tipo'] = 'alumno';

            echo json_encode([
                "exito" => true,
                "mensaje" => "Login correcto como alumno"
            ], JSON_UNESCAPED_UNICODE);
        } else {
            // Credenciales incorrectas
            echo json_encode([
                "exito" => false,
                "mensaje" => "Usuario o contraseña incorrectos."
            ], JSON_UNESCAPED_UNICODE);
        }
    }
} catch (PDOException $e) {
    // Manejo de errores de base de datos
    echo json_encode([
        "exito" => false,
        "mensaje" => "Error de conexión a la BD."
    ], JSON_UNESCAPED_UNICODE);
}
