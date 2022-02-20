-- 
-- depends: 

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    realname VARCHAR(128) NOT NULL DEFAULT '',
    comment VARCHAR(256) NOT NULL DEFAULT '',
    password_hash JSONB NOT NULL
);
CREATE INDEX users_username_idx ON users (username);
