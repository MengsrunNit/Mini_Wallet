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

    //deposit to the wallet 
    async deposit(walletId, amount) {
        const db = getDb();
        const result = await db.query(
            `UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
             WHERE wallet_id = $2 RETURNING *`,
            [amount, walletId]
        );
        return result.rows[0];
    },

    // withdraw from the wallet
    async withdraw(walletId, amount) {
        const db = getDb();
        const result = await db.query(
            `UPDATE wallets SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
             WHERE wallet_id = $2 AND balance >= $1 RETURNING *`,
            [amount, walletId]
        );
        return result.rows[0];
    },

    async findById(walletId) {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM wallets WHERE wallet_id = $1',
            [walletId]
        );
        return result.rows[0];
    },

    // move funds between two wallets atomically
    async transferFunds(fromWalletId, toWalletId, amount) {
        const db = getDb();
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // lock both rows in a consistent order to avoid deadlocks with concurrent transfers
            const [firstId, secondId] = [fromWalletId, toWalletId].sort();
            await client.query('SELECT 1 FROM wallets WHERE wallet_id = $1 FOR UPDATE', [firstId]);
            await client.query('SELECT 1 FROM wallets WHERE wallet_id = $1 FOR UPDATE', [secondId]);

            const withdrawResult = await client.query(
                `UPDATE wallets SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
                 WHERE wallet_id = $2 AND balance >= $1 RETURNING *`,
                [amount, fromWalletId]
            );
            if (withdrawResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const depositResult = await client.query(
                `UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
                 WHERE wallet_id = $2 RETURNING *`,
                [amount, toWalletId]
            );
            if (depositResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            await client.query('COMMIT');
            return { from: withdrawResult.rows[0], to: depositResult.rows[0] };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};

module.exports = Wallet;
