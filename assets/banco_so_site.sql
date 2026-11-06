use sprint3;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(100),
    senha VARCHAR(30)
);

CREATE TABLE locais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);

CREATE TABLE comentario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nota CHAR(5),
    comentario VARCHAR(230),
    fk_local INT,
    fk_usuario INT,

    FOREIGN KEY (fk_local) REFERENCES locais(id),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

