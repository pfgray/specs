
create table if not exists clients (
  id       serial primary key,
  username varchar not null,
  password varchar not null,
  enabled  boolean not null default true
);

create table if not exists courses (
  id              serial primary key,
  name            varchar not null,
  organization_id integer not null references organizations (id)
);

create table if not exists users (
  id              serial primary key,
  name            varchar not null,
  organization_id integer not null references organizations (id)
);

create table if not exists enrollments (
  id         serial primary key,
  user_id    integer not null references users (id),
  course_id  integer not null references organizations (id)
);

create table if not exists activities (
  id         serial primary key,
  course_id  integer not null references organizations (id)
);

create table if not exists tokens (
  id        serial,
  guid      varchar unique,
  client_id   integer not null references clients (id)
);