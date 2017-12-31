-- Up
create table user (
  userid INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  phone TEXT,
  created INTEGER
);

insert into user (email, phone, created) values ('test1@example.com','+19005551212', 1514677744);
insert into user (email, phone, created) values ('test2@example.com','+19005551234', 1514687173);

create table owner (
  ownerid INTEGER PRIMARY KEY AUTOINCREMENT,
  userid INTEGER,
  name TEXT,
  imageid INTEGER,
  created INTEGER
);

-- Down
drop table if exists user;
drop table if exists owner;
