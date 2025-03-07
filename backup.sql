--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: teachmate; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA teachmate;


--
-- Name: kexptype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.kexptype AS ENUM (
    'hook',
    'curiosity',
    'explanation',
    'verification'
);


--
-- Name: media; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.media AS ENUM (
    'video-url',
    'audio-url',
    'text',
    'pdf',
    'image-jpg',
    'image-png',
    'ppt'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: gurukul; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gurukul (
    gid integer NOT NULL,
    gname character varying(255) NOT NULL
);


--
-- Name: gurukul_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gurukul_gid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gurukul_gid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gurukul_gid_seq OWNED BY public.gurukul.gid;


--
-- Name: gurukul_offerings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gurukul_offerings (
    oid integer NOT NULL,
    gid integer,
    gtype character varying(8),
    CONSTRAINT gurukul_offerings_gtype_check CHECK (((gtype)::text = ANY ((ARRAY['G1'::character varying, 'G2'::character varying, 'G3'::character varying, 'G4'::character varying])::text[])))
);


--
-- Name: gurukul_offerings_oid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gurukul_offerings_oid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gurukul_offerings_oid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gurukul_offerings_oid_seq OWNED BY public.gurukul_offerings.oid;


--
-- Name: journey; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journey (
    jid integer NOT NULL,
    subject_id integer,
    topics_id integer,
    lesson_id integer,
    kroute integer
);


--
-- Name: journey_jid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.journey_jid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: journey_jid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.journey_jid_seq OWNED BY public.journey.jid;


--
-- Name: kitems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kitems (
    kid integer NOT NULL,
    ktype public.media NOT NULL,
    kurl character varying(255) NOT NULL,
    kdesc character varying(255),
    kexp public.kexptype NOT NULL
);


--
-- Name: kitems_kid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kitems_kid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kitems_kid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kitems_kid_seq OWNED BY public.kitems.kid;


--
-- Name: kroutes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kroutes (
    krid integer NOT NULL,
    kitems jsonb NOT NULL
);


--
-- Name: kroutes_krid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kroutes_krid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kroutes_krid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kroutes_krid_seq OWNED BY public.kroutes.krid;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    lid integer NOT NULL,
    tid integer,
    lname character varying(255) NOT NULL
);


--
-- Name: lessons_lid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lessons_lid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lessons_lid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lessons_lid_seq OWNED BY public.lessons.lid;


--
-- Name: milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.milestones (
    mid integer NOT NULL,
    gtype character varying(8),
    class smallint,
    level character varying(8),
    CONSTRAINT milestones_gtype_check CHECK (((gtype)::text = ANY ((ARRAY['G1'::character varying, 'G2'::character varying, 'G3'::character varying, 'G4'::character varying])::text[]))),
    CONSTRAINT milestones_level_check CHECK (((level)::text ~ similar_to_escape('L[1-9]|L1[0-2]'::text)))
);


--
-- Name: milestones_mid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.milestones_mid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: milestones_mid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.milestones_mid_seq OWNED BY public.milestones.mid;


--
-- Name: sgurukul; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sgurukul (
    sid integer,
    gid integer,
    starttime timestamp without time zone,
    endtime timestamp without time zone,
    status character varying(255),
    CONSTRAINT sgurukul_status_check CHECK (((status)::text = ANY ((ARRAY['Started'::character varying, 'In_progress'::character varying, 'Done'::character varying])::text[])))
);


--
-- Name: slog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slog (
    sid integer,
    jid integer,
    starttime timestamp without time zone,
    endtime timestamp without time zone,
    status character varying(255),
    CONSTRAINT slog_status_check CHECK (((status)::text = ANY ((ARRAY['Started'::character varying, 'In_progress'::character varying, 'Done'::character varying])::text[])))
);


--
-- Name: smilestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.smilestones (
    sid integer,
    mid integer,
    starttime timestamp without time zone,
    endtime timestamp without time zone,
    status character varying(255),
    CONSTRAINT smilestones_status_check CHECK (((status)::text = ANY ((ARRAY['Started'::character varying, 'In_progress'::character varying, 'Done'::character varying])::text[])))
);


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    sid integer NOT NULL,
    sname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL
);


--
-- Name: students_sid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_sid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_sid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_sid_seq OWNED BY public.students.sid;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    subid integer NOT NULL,
    subname character varying(255) NOT NULL,
    jid integer
);


--
-- Name: subjects_subid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subjects_subid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subjects_subid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subjects_subid_seq OWNED BY public.subjects.subid;


--
-- Name: teacher_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_subjects (
    teachid integer NOT NULL,
    subid integer NOT NULL
);


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teachers (
    teachid integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone
);


--
-- Name: teachers_teachid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teachers_teachid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teachers_teachid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teachers_teachid_seq OWNED BY public.teachers.teachid;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    tid integer NOT NULL,
    subid integer,
    tname character varying(255) NOT NULL
);


--
-- Name: topics_tid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.topics_tid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topics_tid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.topics_tid_seq OWNED BY public.topics.tid;


--
-- Name: kitems; Type: TABLE; Schema: teachmate; Owner: -
--

CREATE TABLE teachmate.kitems (
    kid integer DEFAULT nextval('public.kitems_kid_seq'::regclass) NOT NULL,
    ktype public.media NOT NULL,
    kurl character varying(255) NOT NULL,
    kdesc character varying(255),
    kexp public.kexptype NOT NULL
);


--
-- Name: gurukul gid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gurukul ALTER COLUMN gid SET DEFAULT nextval('public.gurukul_gid_seq'::regclass);


--
-- Name: gurukul_offerings oid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gurukul_offerings ALTER COLUMN oid SET DEFAULT nextval('public.gurukul_offerings_oid_seq'::regclass);


--
-- Name: journey jid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey ALTER COLUMN jid SET DEFAULT nextval('public.journey_jid_seq'::regclass);


--
-- Name: kitems kid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kitems ALTER COLUMN kid SET DEFAULT nextval('public.kitems_kid_seq'::regclass);


--
-- Name: kroutes krid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kroutes ALTER COLUMN krid SET DEFAULT nextval('public.kroutes_krid_seq'::regclass);


--
-- Name: lessons lid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons ALTER COLUMN lid SET DEFAULT nextval('public.lessons_lid_seq'::regclass);


--
-- Name: milestones mid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.milestones ALTER COLUMN mid SET DEFAULT nextval('public.milestones_mid_seq'::regclass);


--
-- Name: students sid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN sid SET DEFAULT nextval('public.students_sid_seq'::regclass);


--
-- Name: subjects subid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects ALTER COLUMN subid SET DEFAULT nextval('public.subjects_subid_seq'::regclass);


--
-- Name: teachers teachid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers ALTER COLUMN teachid SET DEFAULT nextval('public.teachers_teachid_seq'::regclass);


--
-- Name: topics tid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics ALTER COLUMN tid SET DEFAULT nextval('public.topics_tid_seq'::regclass);


--
-- Data for Name: gurukul; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gurukul (gid, gname) FROM stdin;
1	Test Gurukul
3	Test Gurukul G2
\.


--
-- Data for Name: gurukul_offerings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gurukul_offerings (oid, gid, gtype) FROM stdin;
1	1	G2
3	3	G2
\.


--
-- Data for Name: journey; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.journey (jid, subject_id, topics_id, lesson_id, kroute) FROM stdin;
1	1	1	101	1
\.


--
-- Data for Name: kitems; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kitems (kid, ktype, kurl, kdesc, kexp) FROM stdin;
1	video-url	https://example.com/algebra-intro.mp4	Introduction to Algebra Video	hook
2	pdf	https://example.com/algebra-concepts.pdf	Basic Algebra Concepts	explanation
3	text	https://example.com/algebra-quiz.json	Algebra Practice Quiz	verification
601	pdf	https://drive.google.com/file/d/1SwVp__qjK3fNMPr0F5fVG68xKX_DctMR/view?usp=drive_link	K1-curiosity	curiosity
602	pdf	https://drive.google.com/file/d/1FHVn9Mp-BHiUuKaBjIgUBB_2FtfT6mM8/view?usp=drive_link	K2-explanation	explanation
603	video-url	https://drive.google.com/file/d/15xxlK_MbcbPhD2FYz7aOgaE-KRxKRW-M/view?usp=drive_link	K3-Video	explanation
604	pdf	https://drive.google.com/file/d/1Qcohcjvn4IOm8bWUTB5506GtQclpqU2j/view?usp=drive_link	K4-Verification	verification
605	pdf	https://drive.google.com/file/d/1fk0tYoFumXeqTlP-oqhvMN3SgY1aUFcC/view?usp=drive_link	K1-curiosity	curiosity
606	pdf	https://drive.google.com/file/d/1Ws8VicwXugAqeYRDOzZ_l-T06kApivLE/view?usp=drive_link	k2-explanation	explanation
607	video-url	https://drive.google.com/file/d/1rh0cvZIMdbCxHO2qkIihcsiK0KN49-aX/view?usp=drive_link	K3-Video	explanation
608	pdf	https://drive.google.com/file/d/1e3bwxU2gR_ZI8XDgs89WVpiRIEOAtRsR/view?usp=drive_link	K4-verificatin	verification
\.


--
-- Data for Name: kroutes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kroutes (krid, kitems) FROM stdin;
1	[601, 602, 603, 604]
2	[605, 606, 607, 608]
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lessons (lid, tid, lname) FROM stdin;
101	1	Introduction to Algebra
102	1	Variables and Constants
103	1	Solving Linear Equations
201	2	Basic Shapes
202	2	Angles and Lines
203	2	Triangles
301	3	Addition and Subtraction
302	3	Multiplication and Division
303	3	Fractions
\.


--
-- Data for Name: milestones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.milestones (mid, gtype, class, level) FROM stdin;
1	G2	6	L6
2	G2	6	L6
\.


--
-- Data for Name: sgurukul; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sgurukul (sid, gid, starttime, endtime, status) FROM stdin;
1	1	2025-02-20 22:23:34.705836	\N	In_progress
\.


--
-- Data for Name: slog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.slog (sid, jid, starttime, endtime, status) FROM stdin;
1	1	2025-02-21 10:01:29.340459	\N	In_progress
\.


--
-- Data for Name: smilestones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.smilestones (sid, mid, starttime, endtime, status) FROM stdin;
1	2	2025-02-21 00:01:22.736255	\N	In_progress
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (sid, sname, email, password_hash) FROM stdin;
1	Test Student	student@example.com	$2b$10$Mtuwy5IjOt9CKVEtkKmEBO39g3W9nu2M2yWdiuJy0QG8NFDDsCU86
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subjects (subid, subname, jid) FROM stdin;
1	Mathematics	\N
\.


--
-- Data for Name: teacher_subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_subjects (teachid, subid) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teachers (teachid, name, email, password_hash, created_at, last_login) FROM stdin;
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.topics (tid, subid, tname) FROM stdin;
1	1	Algebra
2	1	Geometry
3	1	Arithmetic
\.


--
-- Data for Name: kitems; Type: TABLE DATA; Schema: teachmate; Owner: -
--

COPY teachmate.kitems (kid, ktype, kurl, kdesc, kexp) FROM stdin;
\.


--
-- Name: gurukul_gid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gurukul_gid_seq', 3, true);


--
-- Name: gurukul_offerings_oid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gurukul_offerings_oid_seq', 3, true);


--
-- Name: journey_jid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.journey_jid_seq', 1, false);


--
-- Name: kitems_kid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kitems_kid_seq', 1, false);


--
-- Name: kroutes_krid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kroutes_krid_seq', 1, false);


--
-- Name: lessons_lid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lessons_lid_seq', 1, false);


--
-- Name: milestones_mid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.milestones_mid_seq', 2, true);


--
-- Name: students_sid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_sid_seq', 1, true);


--
-- Name: subjects_subid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subjects_subid_seq', 1, false);


--
-- Name: teachers_teachid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teachers_teachid_seq', 1, false);


--
-- Name: topics_tid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.topics_tid_seq', 1, false);


--
-- Name: gurukul_offerings gurukul_offerings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gurukul_offerings
    ADD CONSTRAINT gurukul_offerings_pkey PRIMARY KEY (oid);


--
-- Name: gurukul gurukul_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gurukul
    ADD CONSTRAINT gurukul_pkey PRIMARY KEY (gid);


--
-- Name: journey journey_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey
    ADD CONSTRAINT journey_pkey PRIMARY KEY (jid);


--
-- Name: kitems kitems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kitems
    ADD CONSTRAINT kitems_pkey PRIMARY KEY (kid);


--
-- Name: kroutes kroutes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kroutes
    ADD CONSTRAINT kroutes_pkey PRIMARY KEY (krid);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (lid);


--
-- Name: milestones milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT milestones_pkey PRIMARY KEY (mid);


--
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (sid);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (subid);


--
-- Name: teacher_subjects teacher_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_pkey PRIMARY KEY (teachid, subid);


--
-- Name: teachers teachers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_email_key UNIQUE (email);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (teachid);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (tid);


--
-- Name: kitems kitems_pkey; Type: CONSTRAINT; Schema: teachmate; Owner: -
--

ALTER TABLE ONLY teachmate.kitems
    ADD CONSTRAINT kitems_pkey PRIMARY KEY (kid);


--
-- Name: gurukul_offerings gurukul_offerings_gid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gurukul_offerings
    ADD CONSTRAINT gurukul_offerings_gid_fkey FOREIGN KEY (gid) REFERENCES public.gurukul(gid);


--
-- Name: journey journey_kroute_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey
    ADD CONSTRAINT journey_kroute_fkey FOREIGN KEY (kroute) REFERENCES public.kroutes(krid);


--
-- Name: journey journey_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey
    ADD CONSTRAINT journey_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(lid);


--
-- Name: journey journey_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey
    ADD CONSTRAINT journey_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(subid);


--
-- Name: journey journey_topics_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey
    ADD CONSTRAINT journey_topics_id_fkey FOREIGN KEY (topics_id) REFERENCES public.topics(tid);


--
-- Name: lessons lessons_tid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_tid_fkey FOREIGN KEY (tid) REFERENCES public.topics(tid);


--
-- Name: sgurukul sgurukul_gid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sgurukul
    ADD CONSTRAINT sgurukul_gid_fkey FOREIGN KEY (gid) REFERENCES public.gurukul(gid);


--
-- Name: sgurukul sgurukul_sid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sgurukul
    ADD CONSTRAINT sgurukul_sid_fkey FOREIGN KEY (sid) REFERENCES public.students(sid);


--
-- Name: slog slog_jid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slog
    ADD CONSTRAINT slog_jid_fkey FOREIGN KEY (jid) REFERENCES public.journey(jid);


--
-- Name: slog slog_sid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slog
    ADD CONSTRAINT slog_sid_fkey FOREIGN KEY (sid) REFERENCES public.students(sid);


--
-- Name: smilestones smilestones_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smilestones
    ADD CONSTRAINT smilestones_mid_fkey FOREIGN KEY (mid) REFERENCES public.milestones(mid);


--
-- Name: smilestones smilestones_sid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smilestones
    ADD CONSTRAINT smilestones_sid_fkey FOREIGN KEY (sid) REFERENCES public.students(sid);


--
-- Name: subjects subjects_jid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_jid_fkey FOREIGN KEY (jid) REFERENCES public.journey(jid) ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_subid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_subid_fkey FOREIGN KEY (subid) REFERENCES public.subjects(subid);


--
-- Name: teacher_subjects teacher_subjects_teachid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_teachid_fkey FOREIGN KEY (teachid) REFERENCES public.teachers(teachid);


--
-- Name: topics topics_subid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_subid_fkey FOREIGN KEY (subid) REFERENCES public.subjects(subid);


--
-- PostgreSQL database dump complete
--

