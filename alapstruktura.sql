-- Adatbázis neve: kerdesek
CREATE DATABASE IF NOT EXISTS kerdesek;
USE kerdesek;
-- Temakor
CREATE TABLE temakor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL
);

-- Role
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO role (name) VALUES
('admin'),
('teacher'),
('student');

-- Login rendszer
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  avatar VARCHAR(255),
  disabled TINYINT(1) DEFAULT 0,
  deleted TINYINT(1) DEFAULT 0,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Feladat
CREATE TABLE feladat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temakor_id INT NOT NULL,
    sorszam INT NOT NULL,
    cim VARCHAR(255) NOT NULL,
    leiras TEXT,
    elvaras TEXT,
    FOREIGN KEY (temakor_id) REFERENCES temakor(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO temakor (nev) VALUES ('HTML');
INSERT INTO temakor (nev) VALUES ('CSS');
INSERT INTO temakor (nev) VALUES ('Bootstrap');
INSERT INTO temakor (nev) VALUES ('Flexbox');
INSERT INTO temakor (nev) VALUES ('Grid');