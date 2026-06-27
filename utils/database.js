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
        client.release();

        // create tables from models if they don't exist
        const User = require('../models/users');
        const Wallet = require('../models/wallet');
        await User.createTable();
        await Wallet.createTable();
        console.log("Tables initialized successfully");

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

module.exports = {
    postgresConnect,
    getDb,
}

