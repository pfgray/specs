
create table if not exists clients (
  id          serial primary key,
  username    varchar not null,
  password    varchar not null,
  created_at  timestamptz not null default NOW(),
  enabled     boolean not null default true
);

create table if not exists organizations (
  id            serial primary key,
  guid          varchar not null,
  name          varchar not null,
  description   varchar,
  url           varchar,
  contact_email varchar,
  created_at    timestamptz not null default NOW(),
  client_id     integer not null references clients (id)
);

create table if not exists courses (
  id              serial primary key,
  name            varchar not null,
  group_type      varchar not null,
  label           varchar not null,
  created_at      timestamptz not null default NOW(),
  organization_id integer not null references organizations (id)
);

create table if not exists users (
  id              serial primary key,
  username        varchar not null,
  given_name      varchar,
  family_name     varchar,
  full_name       varchar,
  contact_email   varchar,
  sourcedid       varchar,
  image           varchar,
  created_at      timestamptz not null default NOW(),
  organization_id integer not null references organizations (id)
);

create table if not exists enrollments (
  id         serial primary key,
  created_at timestamptz not null default NOW(),
  role       varchar not null,
  user_id    integer not null references users (id),
  course_id  integer not null references courses (id),
  unique(user_id, course_id)
);

create table if not exists activities (
  id           serial primary key,
  created_at   timestamptz not null default NOW(),
  course_id    integer not null references organizations (id)
);

create table if not exists tokens (
  id          serial,
  guid        varchar unique,
  created_at  timestamptz not null default NOW(),
  client_id   integer not null references clients (id)
);