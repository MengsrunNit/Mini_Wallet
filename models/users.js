// import database for postgreSQL 
const { getDb } = require('../utils/database');

const User = {
    // create table for user which contain id, uuid is user_id, name, email, password, created_at, updated_at
    async createTable() {
        const db = getDb(); 
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                user_id UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
         await getDb().query(query); 
    },
         
    // create a new user 
    async createUser(name, email, password) {
        const db = getDb();
        const query = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [name, email, password];
        const result = await db.query(query, values);
        return result.rows[0];  
    },
    // verify if user exist by email 
    async findByEmail(email) {
        const db = getDb();
        const query = `
            SELECT * FROM users WHERE email = $1
        `;
        const values = [email];
        const result = await db.query(query, values);
        return result.rows[0];  
    }, 
    // find by id
    async findById(id) {
        const db = getDb();
        const query = `
            SELECT * FROM users WHERE user_id = $1
        `;
        const values = [id];
        const result = await db.query(query, values);
        return result.rows[0];
    },
    // delete by id
    async deleteById(id) {
        const db = getDb();
        const query = `
            DELETE FROM users WHERE user_id = $1
            RETURNING *
        `;
        const values = [id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

}

module.exports = User;