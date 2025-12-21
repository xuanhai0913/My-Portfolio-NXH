const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = await pool.connect();

        try {
            // Create table if it doesn't exist
            await client.query(`
        CREATE TABLE IF NOT EXISTS page_views (
          id SERIAL PRIMARY KEY,
          page VARCHAR(255) NOT NULL DEFAULT 'portfolio',
          view_count INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            // Check if portfolio entry exists
            const checkResult = await client.query(
                "SELECT * FROM page_views WHERE page = 'portfolio'"
            );

            if (checkResult.rows.length === 0) {
                // Insert initial count: 105 + 12588 = 12693
                await client.query(
                    "INSERT INTO page_views (page, view_count) VALUES ('portfolio', 12693)"
                );

                return res.status(200).json({
                    success: true,
                    message: 'Database initialized successfully',
                    initialCount: 12693
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Database already initialized',
                    currentCount: checkResult.rows[0].view_count
                });
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
            error: 'Database initialization failed',
            details: error.message
        });
    }
};
