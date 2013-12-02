-- Table: "Services"

CREATE TABLE "Services"
(
  "ID" integer NOT NULL,
  "Title" character varying NOT NULL,
  "Description" text,
  "Keywords" integer,
  "Language" integer,
  "Input_Format" integer,
  "Date_Creation" date,
  "Date" date NOT NULL,
  "URL_to_reference" text,
  "URL_to_data" text NOT NULL,
  "Newest" boolean NOT NULL,
  reference_data xml,
  "Input_CRS" integer,
  CONSTRAINT "Services_pkey" PRIMARY KEY ("ID"),
  CONSTRAINT "Services_URL_to_data_key" UNIQUE ("URL_to_data")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Services"
  OWNER TO postgres;

  
  
-- Table: "Input_CRS"

CREATE TABLE "Input_CRS"
(
  "ID" integer NOT NULL,
  "CRS" character varying NOT NULL,
  CONSTRAINT "Input_CRS_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Input_CRS"
  OWNER TO postgres;

 
 
-- Table: "Input_Format"

CREATE TABLE "Input_Format"
(
  "ID" integer NOT NULL,
  "Format" character varying NOT NULL,
  CONSTRAINT "Input_Format_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Input_Format"
  OWNER TO postgres;

  
  
-- Table: "Keywords"

CREATE TABLE "Keywords"
(
  "ID" integer NOT NULL,
  "Keyword" character varying NOT NULL,
  CONSTRAINT "Keywords_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Keywords"
  OWNER TO postgres;
  
  
  
-- Table: "Language"

CREATE TABLE "Language"
(
  "ID" integer NOT NULL,
  "Language" character varying NOT NULL,
  CONSTRAINT "Language_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Language"
  OWNER TO postgres;

  
-- Table: "User"


CREATE TABLE "User"
(
  "ID" integer NOT NULL,
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
  OWNER TO postgres;
