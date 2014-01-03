--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: my_schema; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA my_schema;


ALTER SCHEMA my_schema OWNER TO postgres;

--
-- Name: test_db; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA test_db;


ALTER SCHEMA test_db OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: User; Type: TABLE; Schema: public; Owner: test_user; Tablespace: 
--

CREATE TABLE "User" (
    "ID" integer NOT NULL,
    user_name text NOT NULL,
    e_mail text,
    passwort character varying(64) NOT NULL
);


ALTER TABLE public."User" OWNER TO test_user;

--
-- Name: service; Type: TABLE; Schema: public; Owner: test_user; Tablespace: 
--

CREATE TABLE service (
    id integer NOT NULL,
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
    geometry geometry(Geometry,4326)
);


ALTER TABLE public.service OWNER TO test_user;

--
-- Name: service_id_seq; Type: SEQUENCE; Schema: public; Owner: test_user
--

CREATE SEQUENCE service_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_id_seq OWNER TO test_user;

--
-- Name: service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_user
--

ALTER SEQUENCE service_id_seq OWNED BY service.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY service ALTER COLUMN id SET DEFAULT nextval('service_id_seq'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: test_user
--

COPY "User" ("ID", user_name, e_mail, passwort) FROM stdin;
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: test_user
--

COPY service (id, title, descr, keywords, lang, input_format, date_creation, date, url_reference, url_data, is_latest, reference_data, input_crs, geometry) FROM stdin;
22	title_01	description_01	building;street	en;de	citygml	2013-12-01	2013-12-01	http://www.url_1001_reference.de	http://www.url_1001_data.de	t	\N	EPSG:4326;EPSG:3068	0101000020E6100000E5F21FD26F3F2840F965304624864A40
23	title_02	description_02	facility	de	kml;citygml	2013-12-02	2013-12-02	http://www.url_1002_reference.de	http://www.url_1002_data.de	t	\N	EPSG:4326;EPSG:3068	0101000020E61000004B598638D625284093FFC9DFBD1F4A40
24	title_03	description_03	indusrty	en;de	citygml	2013-12-03	2013-12-03	http://www.url_1003_reference.de	http://www.url_1003_data.de	t	\N	EPSG:4326;EPSG:3068	0101000020E61000004B598638D6252A40C632FD12F1524A40
25	title_04	description_04	facility	en;de	citygml	2013-12-04	2013-12-04	http://www.url_1004_reference.de	http://www.url_1004_data.de	t	\N	EPSG:4326	0101000020E61000000E4FAF94652828402D99637957794A40
26	title_05	description_05	business	en;de	citygml	2013-12-05	2013-12-05	http://www.url_1005_reference.de	http://www.url_1005_data.de	t	\N	EPSG:3068	0101000020E61000004B598638D6252A40B284B531761E4A40
27	title_06	description_06	building;street	en;fr	kml	2013-12-06	2013-12-06	http://www.url_1006_reference.de	http://www.url_1006_data.de	t	\N	EPSG:3068	0101000020E61000004B598638D625284093FFC9DFBD9F4A40
28	title_07	description_07	facility	en;de	citygml	2013-12-07	2013-12-07	http://www.url_1007_reference.de	http://www.url_1007_data.de	t	\N	EPSG:3068;EPSG:3857	0101000020E610000018265305A3F2274093FFC9DFBDDF4940
29	title_08	description_08	indusrty	en;de	citygml;geojson	2013-12-08	2013-12-08	http://www.url_1008_reference.de	http://www.url_1008_data.de	t	\N	EPSG:3068;EPSG:3857	0101000020E61000004B598638D6252C402D99637957794940
30	title_09	description_09	facility	en;fr	geojson	2013-12-09	2013-12-09	http://www.url_1009_reference.de	http://www.url_1009_data.de	t	\N	EPSG:3857	0101000020E61000009D11A5BDC1772840FE43FAEDEB504A40
31	title_10	description_10	building;street	en;fr	geojson;kml	2013-12-10	2013-12-10	http://www.url_1010_reference.de	http://www.url_1010_data.de	t	\N	EPSG:3068;EPSG:3857	0101000020E61000004B598638D6252A4093FFC9DFBD9F4940
\.


--
-- Name: service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_user
--

SELECT pg_catalog.setval('service_id_seq', 31, true);


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Name: User_pkey; Type: CONSTRAINT; Schema: public; Owner: test_user; Tablespace: 
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("ID");


--
-- Name: User_user_name_key; Type: CONSTRAINT; Schema: public; Owner: test_user; Tablespace: 
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT "User_user_name_key" UNIQUE (user_name);


--
-- Name: service_pkey; Type: CONSTRAINT; Schema: public; Owner: test_user; Tablespace: 
--

ALTER TABLE ONLY service
    ADD CONSTRAINT service_pkey PRIMARY KEY (id);


--
-- Name: service_url_data_key; Type: CONSTRAINT; Schema: public; Owner: test_user; Tablespace: 
--

ALTER TABLE ONLY service
    ADD CONSTRAINT service_url_data_key UNIQUE (url_data);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

