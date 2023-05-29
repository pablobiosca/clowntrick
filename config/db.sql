create table users (
    id int unsigned auto_increment primary key,
    email varchar(150),
    nickname varchar(200),
    password varchar(200),
    fecha_creacion DATE DEFAULT (DATE(NOW())),
    mensajes int default 0
);


create table hilos (
    id int unsigned auto_increment primary key,
    titulo varchar(250),
    texto text,
    views int default 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_user int unsigned,
    foreign key (id_user) references users(id)
);

create table replys (
    texto text,
    id_hilo int unsigned,
    id_user int unsigned,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    foreign key (id_hilo) references hilos(id),
    foreign key (id_user) references users(id)
);
