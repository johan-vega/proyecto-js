<?php
// PASO 1: VAMOS A CREAR LAS CABECERAS HTTP ESTRICTAS PARA UNA API RESTFUL
header("Access-Control-Allow-Origin: *"); // PERMITE PETICIONES DESDE CUALQUIER ORIGEN 
header("content-type: application/json; charset=UTF-8"); // INDICA QUE LA RESPUESTA SIEMPRE SERA EN FORMATO JSON Y CON EL ESTANDAR UTF-8: TILDES
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); // INDICO LOS METODOS PERMITIDOS
// header("Access-Control-Allow-Headers:"); 

//PASO 2: ESTABLECEMOS CONEXION CON LA BASE DE DATOS
$host = 'localhost';
$db = 'BD_MATRICULA';
$user = 'root';
$pass = '';
try {
    $pdo  = new PDO("mysql:host=$host; dbname=$db; charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    //si la conexion falla, la API va a devolver un HORROR 500 ( Internal Server Error )
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de conexion a la Base de Datos"]);
    exit();
}

// PASO 3: CAPTURAMOS EL METODO HTTP
$metodoHTTP = $_SERVER['REQUEST_METHOD'];

//PASO 4: CREAMOS LAS PETICIONES CON SWITCH
switch ($metodoHTTP) {
    case 'GET': // obtener informacion del salon 
        if (isset($_GET['id'])) {
            $MSsql = "SELECT * FROM AULA WHERE ID_AULA =  : id";
            $MSstmt = $pdo->prepare($MSsql);
            $MSstmt->execute(['id' => $_GET['id']]);
            $resultado = $MSstmt->fetch(PDO::FETCH_ASSOC); //fetch_assoc es para traer la info en tiempo real es componente de php
        } else {
            //vamos a obtener todas las tablas
            $MSsql = "SELECT * FROM AULA";
            $MSstmt = $pdo->query($MSsql);
            $resultado = $MSstmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($resultado);
        }
        break;
    case 'POST':
        // Leer el JSON que envía el cliente
        $datosJSON = json_decode(file_get_contents("php://input"));

        // Validar que lleguen los datos requeridos
        if (!empty($datosJSON->nivel) && !empty($datosJSON->grado) && !empty($datosJSON->seccion)) {

            $sql = "INSERT INTO AULA (NIVEL, GRADO, SECCION, VACANTES_TOTALES, VACANTES_DISPONIBLES) 
                    VALUES (:nivel, :grado, :seccion, :totales, :disponibles)";

            $stmt = $pdo->prepare($sql);

            // Ejecutar con los datos del JSON
            $exito = $stmt->execute([
                'nivel' => $datosJSON->nivel,
                'grado' => $datosJSON->grado,
                'seccion' => $datosJSON->seccion,
                'totales' => $datosJSON->vacantes_totales,
                'disponibles' => $datosJSON->vacantes_disponibles
            ]);

            if ($exito) {
                http_response_code(201); // Created
                echo json_encode(["mensaje" => "Aula creada con éxito."]);
            } else {
                http_response_code(503); // Service Unavailable
                echo json_encode(["mensaje" => "No se pudo crear el aula."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["mensaje" => "Datos incompletos. Faltan campos requeridos."]);
        }
        break;
    case 'PUT':
        $datosJSON = json_decode(file_get_contents("php://input"));

        // Para hacer un UPDATE, necesitamos el ID obligatoriamente
        if (!empty($datosJSON->id_aula)) {

            $sql = "UPDATE AULA 
                    SET NIVEL = :nivel, GRADO = :grado, SECCION = :seccion, 
                        VACANTES_TOTALES = :totales, VACANTES_DISPONIBLES = :disponibles 
                    WHERE ID_AULA = :id";

            $stmt = $pdo->prepare($sql);

            $exito = $stmt->execute([
                'nivel' => $datosJSON->nivel,
                'grado' => $datosJSON->grado,
                'seccion' => $datosJSON->seccion,
                'totales' => $datosJSON->vacantes_totales,
                'disponibles' => $datosJSON->vacantes_disponibles,
                'id' => $datosJSON->id_aula
            ]);

            if ($exito) {
                http_response_code(200); // OK
                echo json_encode(["mensaje" => "Aula actualizada correctamente."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "No se pudo actualizar el aula."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["mensaje" => "Falta el ID del aula a actualizar."]);
        }
        break;
    case 'DELETE':
        $datosJSON = json_decode(file_get_contents("php://input"));

        if (!empty($datosJSON->id_aula)) {
            $sql = "DELETE FROM AULA WHERE ID_AULA = :id";
            $stmt = $pdo->prepare($sql);
            $exito = $stmt->execute(['id' => $datosJSON->id_aula]);

            if ($exito) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Aula eliminada correctamente."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "No se pudo eliminar el registro."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Falta el ID del aula a eliminar."]);
        }
        break;

    default:
        # code... 
        break;
}
