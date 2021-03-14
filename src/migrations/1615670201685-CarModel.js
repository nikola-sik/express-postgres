

const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS car_models (
    id uuid PRIMARY KEY,
    model text,
    color text, 
    production_year text
  );

  CREATE TABLE IF NOT EXISTS cars (
    id uuid PRIMARY KEY,
    registration_number text UNIQUE,
    user_id uuid REFERENCES users (id) ON DELETE CASCADE,
    car_model_id uuid REFERENCES car_models (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS garages (
    id uuid PRIMARY KEY,
    address text,
    car_id uuid REFERENCES cars (id) ON DELETE CASCADE
  );

  `);

  await client.query(`
  CREATE INDEX cars_registration_number on cars (registration_number);

  CREATE INDEX garages_car on garages (car_id);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE car_models;
  DROP TABLE cars;
  DROP TABLE garages;
  `);

  await client.release(true);
  next();
};
