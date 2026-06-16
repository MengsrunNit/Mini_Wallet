// create postgreSQL connection pool
require('dotenv').config();
const { Pool } = require('pg');

let pool; 

const postgresConnect = async () => {
    // create a connection pool using the connection string from the env variable 
    const connectionString = process.env.DATABASE_URL; 

    // check if connection string is available
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    try {
        pool = new Pool({
            connectionString,
        });

        // test the connection 
        const client = await pool.connect(); 
        console.log("Connected to the database successfully");
        // release the client back to the pool
        client.release();

    } catch (err) {
        console.error('Error creating database connection pool', err);
        throw err;
    }
};

const getDb = () => {
    if (pool){
        return pool; 
    }
    throw new Error('Database connection pool has not been initialized');
}

const ensureUsersTable = async () => {
    const db = getDb();
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

module.exports = {
    postgresConnect,
    getDb,
    ensureUsersTable,
}

