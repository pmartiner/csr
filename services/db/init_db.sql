BEGIN;
CREATE TABLE users (
    id_leader                   bigserial PRIMARY KEY,
    name                        text NOT NULL,
    surname_fath                text NOT NULL,
    surname_math                text NOT NULL,
    birthdate                   date,
    marital_status              text,
    academic_degree             text,
    headquarters                text,
    network                     text,
    house_type                  text,
    conversion_date             date,
    first_encounter_date        date,
    email                       text UNIQUE NOT NULL,
    password                    text,
    mobile                      text UNIQUE NOT NULL,
    street                      text,
    street_num                  text,
    neighborhood                text,
    municipality                text,
    state                       text,
    pc                          text,
    interested_people           boolean,
    notif_family                boolean,
    notif_kids                  boolean,
    notif_parents_school        boolean,
    notif_marriage              boolean,
    notif_youth                 boolean,
    notif_teens                 boolean,
    notif_entrepreneurship      boolean,
    notif_reach                 boolean,
    notif_praise                boolean,
    notif_againt_slave_traffic  boolean,
    notif_good_news             boolean,
    notif_prayer                boolean,
    notif_older_adults          boolean,
    id_father                   bigint,
    leader                      boolean NOT NULL,
    admin                       boolean NOT NULL
);
COMMIT;

-- BEGIN;
-- CREATE TABLE users (
--     id_user                     bigserial PRIMARY KEY,
--     mobile                      text UNIQUE NOT NULL,
--     email                       text UNIQUE NOT NULL,
--     name                        text NOT NULL,
--     surname_fath                text NOT NULL,
--     surname_math                text NOT NULL,
--     password                    text
-- );
-- COMMIT;

BEGIN;
CREATE TABLE courses (
    id_course                   bigserial UNIQUE,
    day                         text NOT NULL,
    start_day                   date NOT NULL,
    start_time                  time NOT NULL,
    end_time                    time NOT NULL,
    attendance_type             text NOT NULL,
    house_type                  text NOT NULL,
    course_name                 text NOT NULL,
    description                 text NOT NULL,
    street                      text NOT NULL,
    street_num                  text NOT NULL,
    interior_num                text,
    latitude                    double precision,
    longitude                   double precision,
    neighborhood                text NOT NULL,
    municipality                text NOT NULL,
    state                       text NOT NULL,
    pc                          text NOT NULL,
    phone                       text NOT NULL,
    id_leader                   bigserial REFERENCES users(id_leader),
    PRIMARY KEY(id_course, id_leader)
);
COMMIT;

BEGIN;
CREATE TABLE attendances (
    id_attendances              bigserial UNIQUE,
    tithe                       real NOT NULL,
    donation                    real NOT NULL,
    date_report                 date,
    date_course                 date NOT NULL,    
    attendances                 json NOT NULL, 
    id_course                   bigserial REFERENCES courses(id_course)
);
COMMIT;

BEGIN;
CREATE TABLE registries (
    id_leader                 bigserial REFERENCES users(id_leader),
    id_course                 bigserial REFERENCES courses(id_course),
    date                      date NOT NULL,
    PRIMARY KEY(id_course, id_leader)
);
COMMIT;