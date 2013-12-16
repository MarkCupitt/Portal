-- Table: service

-- DROP TABLE service;

CREATE TABLE service
(
  id serial NOT NULL,
  title character varying NOT NULL,
  descr text,
  keywords integer,
  lang integer,
  input_format integer,
  date_creation date,
  date date NOT NULL,
  url_reference text,
  url_data text NOT NULL,
  is_latest boolean NOT NULL,
  reference_data xml,
  input_crs integer,
  CONSTRAINT service_pkey PRIMARY KEY (id),
  CONSTRAINT service_url_data_key UNIQUE (url_data)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE service
  OWNER TO test_user;


-- Table: "Input_CRS"

CREATE TABLE "Input_CRS"
(
  "ID" serial NOT NULL,
  "CRS" character varying NOT NULL,
  CONSTRAINT "Input_CRS_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Input_CRS"
  OWNER TO test_user;



-- Table: "Input_Format"

CREATE TABLE "Input_Format"
(
  "ID" serial NOT NULL,
  "Format" character varying NOT NULL,
  CONSTRAINT "Input_Format_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Input_Format"
  OWNER TO test_user;



-- Table: "Keywords"

CREATE TABLE "Keywords"
(
  "ID" serial NOT NULL,
  "Keyword" character varying NOT NULL,
  CONSTRAINT "Keywords_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Keywords"
  OWNER TO test_user;



-- Table: "Language"

CREATE TABLE "Language"
(
  "ID" serial NOT NULL,
  "Language" character varying NOT NULL,
  CONSTRAINT "Language_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Language"
  OWNER TO test_user;


-- Table: "User"


CREATE TABLE "User"
(
  "ID" serial NOT NULL,
  user_name text NOT NULL,
  e_mail text,
  passwort character varying(64) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("ID"),
  CONSTRAINT "User_user_name_key" UNIQUE (user_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "User"
  OWNER TO test_user;
