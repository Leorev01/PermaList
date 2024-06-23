CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  date DATE NOT NULL
);

INSERT INTO items (title, date) VALUES ('Buy milk', '23/06/2024'), ('Finish homework', '23/06/2024');