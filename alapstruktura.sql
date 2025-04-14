-- Adatbázis neve: kerdesek
-- Temakor
CREATE TABLE temakor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL
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