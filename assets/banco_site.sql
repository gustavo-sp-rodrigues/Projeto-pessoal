use sprint3;

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
select * from comentario  Join locais ON locais.id = comentario.fk_local where locais.id = 1; -- pelezao

select * from comentario  Join locais ON locais.id = comentario.fk_local where locais.id = 2; -- villa lobos

select * from comentario  Join locais ON locais.id = comentario.fk_local where locais.id = 3; -- sesc pompeia

select * from comentario 
Join locais ON locais.id = comentario.fk_local ; -- todos os comentarios

