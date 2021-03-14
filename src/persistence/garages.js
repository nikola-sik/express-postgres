const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');

const db = require('./db');

module.exports = {
  async create(address, car_id) {
    try {
      
      const {rows} = await db.query(sql`
      INSERT INTO garages (id, address, car_id)
        VALUES (${uuidv4()}, ${address}, ${car_id})
        RETURNING id, address, car_id;
      `);

      const [car] = rows;
      return car;
    } catch (error) {
      if (error.constraint === 'garages_key') {
        return null;
      }

      throw error;
    }
  },
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM garages WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async findCarInGarageById(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM garages WHERE car_id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async update(id, address, car_id) {
    try {

        const {rows} = await db.query(sql`
        UPDATE garages SET (address, car_id) = 
        (${address}, ${car_id})
        WHERE id = ${id} RETURNING id, address, car_id;
        `);
        const [car] = rows;
        return car;

    } catch (error) {        
        throw error;
    }
  },
  async delete(id) {
    await db.query(sql`
    DELETE FROM garages WHERE id = ${id};
    `);
  }
};
