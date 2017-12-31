-- Up
create table user (
  userid INTEGER primary key,
  email TEXT,
  phone TEXT,
  created INTEGER
);

insert into user values (1,'lindea85@gmail.com','206-551-2060', 1514677744);
insert into user values (2,'lindea85@gmail.com','206-551-2060', 1514677744);

create table owner (
  ownerid INTEGER primary key,
  userid INTEGER,
  name TEXT,
  imageid INTEGER,
  created INTEGER
);


-- Down
drop table user;
drop table owner;
