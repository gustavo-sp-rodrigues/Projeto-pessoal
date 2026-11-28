create database volei_sp;
use volei_sp;

CREATE TABLE usuario (
id int NOT NULL AUTO_INCREMENT primary key,
nome varchar(45) NOT NULL,
email varchar(100) NOT NULL,
senha varchar(30) NOT NULL
);

CREATE TABLE locais (
id int NOT NULL AUTO_INCREMENT primary key,
nome varchar(45) DEFAULT NULL
);

insert into locais (nome) values 
('pelezão'),
('villa Lobbos'),
('sesc pompeia');

CREATE TABLE comentario (
id int NOT NULL AUTO_INCREMENT,
nota_localizacao char(5) DEFAULT NULL,
nota_estrutura char(5) DEFAULT NULL,
nota_ambiente char(5) DEFAULT NULL,
comentario varchar(230) DEFAULT NULL,
fk_local int DEFAULT NULL,
fk_usuario int DEFAULT NULL,
PRIMARY KEY (id),
foreign key (fk_local) references locais(id),
foreign key(fk_usuario) references usuario(id)
);