-- Up
create table user (
  userid INTEGER primary key,
  email TEXT,
  phone TEXT,
  created INTEGER
);

insert into user values (1,'test1@example.com','+19005551212', 1514677744);
insert into user values (2,'test2@example.com','+19005551234', 1514687173);

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
