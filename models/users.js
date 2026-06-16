// import database for postgreSQL 
const { getDb } = require('../utils/database');

const User = {
    // create a new user: 
    async create(name, email, password){
        const query = `INSERT INTO users (name, email, password) 
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at`;

        const results = await getDb().query(query, [name, email, password]); 
        return results.rows[0];
    }, 

    // find a user by email: 
    async findByEmail(email){
        const query = `SELECT id, name, email, password FROM users WHERE email = $1`;
        const results = await getDb().query(query, [email]);
        return results.rows[0];
    },

    // fetch all users:
    async getAllUsers(){
        const query = `SELECT id, name, email, created_at FROM users ORDER BY id ASC`;
        const results = await getDb().query(query);
        return results.rows;
    }
}

module.exports = User;