-- PostGIS aktivieren
-- create extension postgis;

DROP TABLE service;

CREATE TABLE service
(
  id serial NOT NULL,
  title character varying NOT NULL,
  descr text,
  keywords text,
  source_format character varying(20),
  source_date date,
  date date NOT NULL,
  url_reference text,
  source_url text NOT NULL,
  is_latest boolean NOT NULL,
  reference_data xml,
  source_crs character varying(15),
  geometry geometry(Geometry, 4326),
  CONSTRAINT service_pkey PRIMARY KEY (id),
  CONSTRAINT service_source_url_key UNIQUE (source_url)
);
ALTER TABLE service
  OWNER TO test_user;

DROP TABLE "user";

CREATE TABLE "user"
(
  id serial NOT NULL,
  user_name text NOT NULL,
  e_mail text,
  passwort character varying(64) NOT NULL,
  CONSTRAINT "user_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_user_name_key" UNIQUE (user_name)
);
ALTER TABLE "user"
  OWNER TO test_user;
