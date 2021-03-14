const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');

const db = require('./db');

module.exports = {
  async create(registration_number, user_id, car_model_id) {
    try {
      
      const {rows} = await db.query(sql`
      INSERT INTO cars (id, registration_number, user_id, car_model_id)
        VALUES (${uuidv4()}, ${registration_number}, ${user_id}, ${car_model_id})
        RETURNING id, registration_number, user_id, car_model_id;
      `);

      const [car] = rows;
      return car;
    } catch (error) {
      if (error.constraint === 'cars_registration_number_key') {
        return null;
      }

      throw error;
    }
  },
  async find(registration_number) {
    const {rows} = await db.query(sql`
    SELECT * FROM cars WHERE registration_number=${registration_number} LIMIT 1;
    `);
    return rows[0];
  },
  async update(id, registration_number, user_id, car_model_id) {
    try {

      const {rows} = await db.query(sql`
        UPDATE cars SET (registration_number, user_id, car_model_id) = 
        (${registration_number}, ${user_id}, ${car_model_id})
        WHERE id = ${id} RETURNING id, registration_number, user_id, car_model_id;
        `);
      
        const [car] = rows;
        return car;

    } catch (error) {
        if (error.constraint === 'cars_registration_number_key') {
        return null;
    }
        throw error;
    }
  },
  async delete(registration_number) {
    await db.query(sql`
    DELETE FROM cars WHERE registration_number = ${registration_number};
    `);
  }
};
