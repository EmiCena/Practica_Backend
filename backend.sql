CREATE TABLE persona (
  dni INT PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL,
  apellido VARCHAR(30) NOT NULL
);
CREATE TABLE usuario (
  mail VARCHAR(40) PRIMARY KEY,
  nickname VARCHAR(20) NOT NULL,
  pass VARCHAR(20) NOT NULL,
  persona INT,
  FOREIGN KEY (persona) REFERENCES persona(dni)
);


