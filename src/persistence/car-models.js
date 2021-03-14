const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');

const db = require('./db');

module.exports = {
  async create(model, color, production_year) {
    try {
      
      const {rows} = await db.query(sql`
      INSERT INTO car_models (id, model, color, production_year)
        VALUES (${uuidv4()}, ${model}, ${color}, ${production_year})
        RETURNING id, model, color, production_year;
      `);

      const [carModel] = rows;
      return carModel;
    } catch (error) {
      if (error.constraint === 'car_models_key') {
        return null;
      }

      throw error;
    }
  },
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM car_models WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async update(id, model, color, production_year) {
    try {

       const {rows} = await db.query(sql`
        UPDATE car_models SET ( model, color, production_year) = 
        (${model}, ${color}, ${production_year})
        WHERE id = ${id} RETURNING id,  model, color, production_year;
        `);

      const [carModel] = rows;
      return carModel;

    } catch (error) {       
        throw error;
    }
  },
  async delete(id) {
    await db.query(sql`
    DELETE FROM car_models WHERE id = ${id};
    `);
  }
};
