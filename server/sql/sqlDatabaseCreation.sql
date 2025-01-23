
-- La tabla Usuarios es una estructura fundamental que almacena información esencial de los usuarios, 
-- conteniendo un identificador único (id), correo electrónico para contacto e inicio de sesión, 
-- nombre para identificación personal, una contraseña encriptada para garantizar la seguridad de acceso,
-- un campo 'xp' que registra los puntos de experiencia acumulados por el 
-- usuario (permitiendo gestionar niveles en otra parte del sistema), 
-- y un campo 'tiempo_jugado' que almacena el tiempo total de juego en segundos (facilitando el cálculo y 
-- presentación del tiempo de juego en formatos más legibles).
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    play_time INT DEFAULT 0
);



-- La tabla Imágenes está diseñada para gestionar los archivos multimedia asociados a los usuarios, 
-- donde cada registro contiene un identificador propio, la ruta o ubicación del archivo de imagen y 
-- una clave foránea (usuario_id) que establece la relación directa con el usuario propietario, 
-- permitiendo un seguimiento preciso de los recursos gráficos dentro del sistema.
CREATE TABLE Pictures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    path VARCHAR(255) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
