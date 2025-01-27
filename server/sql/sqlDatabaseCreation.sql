
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    play_time INT DEFAULT 0,
    rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente'
);

CREATE TABLE Pictures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    is_active BOOLEAN UNIQUE NOT NULL, 
    path VARCHAR(255) NOT NULL DEFAULT 'default.png',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

ALTER TABLE Pictures ADD CONSTRAINT uq_user_picture_active UNIQUE (user_id, is_active);




