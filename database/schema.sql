-- Create the following tables

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL,
  color VARCHAR(15) NOT NULL
);

CREATE TABLE world_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) PRIMARY KEY,
  country_name VARCHAR(50) NOT NULL
);

CREATE TABLE named_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_country_user
    UNIQUE (country_code, user_id)
);
