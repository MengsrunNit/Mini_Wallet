const { getDb } = require('../utils/database');

const Wallet = {
    async createTable() {
        const db = getDb();
        const query = `
            CREATE TABLE IF NOT EXISTS wallets (
                id SERIAL PRIMARY KEY,
                wallet_id UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
                user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
                currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.query(query);
    },

    async findByUserId(userId) {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM wallets WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    },

    async createWallet(userId, currency = 'USD') {
        const db = getDb();
        const result = await db.query(
            `INSERT INTO wallets (user_id, currency) VALUES ($1, $2) RETURNING *`,
            [userId, currency]
        );
        return result.rows[0];
    },

    async updateBalance(userId, amount) {
        const db = getDb();
        const result = await db.query(
            `UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $2 RETURNING *`,
            [amount, userId]
        );
        return result.rows[0];
    },
};

module.exports = Wallet;
