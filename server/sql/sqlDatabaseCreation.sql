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
    is_active BOOLEAN NOT NULL, 
    path VARCHAR(255) NOT NULL DEFAULT 'default.png',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE verification_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR)
);


ALTER TABLE Pictures ADD CONSTRAINT uq_user_picture_active UNIQUE (user_id, is_active);




