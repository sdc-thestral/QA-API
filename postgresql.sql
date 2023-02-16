-- DROP DATABASE IF EXISTS questionsanswers;

CREATE DATABASE questionsanswers
    WITH
    OWNER = ctunakan
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE IF NOT EXISTS questionsanswers.questions
(
    question_id integer NOT NULL,
    product_id integer NOT NULL,
    question_body character varying COLLATE pg_catalog."default" NOT NULL,
    question_date bigint,
    asker_name character varying COLLATE pg_catalog."default" NOT NULL,
    asker_email character varying COLLATE pg_catalog."default",
    question_helpfulness integer NOT NULL DEFAULT 0,
    question_reported integer DEFAULT 0,
    CONSTRAINT questions_pkey PRIMARY KEY (question_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS questionsanswers.questions
    OWNER to ctunakan;


CREATE TABLE IF NOT EXISTS questionsanswers.answers
(
    answer_id integer NOT NULL,
    question_id integer NOT NULL,
    answer_body character varying COLLATE pg_catalog."default" NOT NULL,
    answerer_name character varying COLLATE pg_catalog."default" NOT NULL,
    answerer_email character varying COLLATE pg_catalog."default" NOT NULL,
    answer_helpfulness integer NOT NULL DEFAULT 0,
    answer_date bigint,
    answer_reported integer,
    CONSTRAINT answers_pkey PRIMARY KEY (answer_id),
    CONSTRAINT question_id FOREIGN KEY (question_id)
        REFERENCES questionsanswers.questions (question_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS questionsanswers.answers
    OWNER to ctunakan;
-- Index: fki_question_id

-- DROP INDEX IF EXISTS questionsanswers.fki_question_id;

CREATE INDEX IF NOT EXISTS fki_question_id
    ON questionsanswers.answers USING btree
    (question_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS questionsanswers.answer_photos
(
    photo_id integer NOT NULL,
    answer_id integer NOT NULL,
    photo_url character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT answers_photos_pkey PRIMARY KEY (photo_id),
    CONSTRAINT answer_id FOREIGN KEY (answer_id)
        REFERENCES questionsanswers.answers (answer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS questionsanswers.answer_photos
    OWNER to ctunakan;