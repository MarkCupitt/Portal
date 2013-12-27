-- PostGIS aktivieren
-- create extension postgis;

-- Table: service

-- DROP TABLE service;

CREATE TABLE service
(
  id serial NOT NULL,
  title character varying NOT NULL,
  descr text,
  keywords text,
  lang text,
  input_format text,
  date_creation date,
  date date NOT NULL,
  url_reference text,
  url_data text NOT NULL,
  is_latest boolean NOT NULL,
  reference_data xml,
  input_crs text,
  CONSTRAINT service_pkey PRIMARY KEY (id),
  CONSTRAINT service_url_data_key UNIQUE (url_data)
);
ALTER TABLE service
  OWNER TO test_user;

-- create Geometry Column   

--ALTER TABLE test_db.public.service ADD COLUMN geometry geometry(Geometry, 4326);

-- Table: "User"


CREATE TABLE "User"
(
  id serial NOT NULL,
  user_name text NOT NULL,
  e_mail text,
  passwort character varying(64) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_user_name_key" UNIQUE (user_name)
);
ALTER TABLE "User"
  OWNER TO test_user;
