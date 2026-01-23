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
    // Set Cache-Control to prevent Vercel/Browser caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = await pool.connect();

        try {
            // Get current count
            const selectResult = await client.query(
                "SELECT view_count FROM page_views WHERE page = 'portfolio'"
            );

            if (selectResult.rows.length === 0) {
                // If no record exists, return error asking to initialize
                return res.status(404).json({
                    success: false,
                    error: 'Database not initialized. Please visit /api/init-db first.'
                });
            }

            const currentCount = selectResult.rows[0].view_count;

            // Increment view count
            const updateResult = await client.query(
                `UPDATE page_views 
         SET view_count = view_count + 1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE page = 'portfolio' 
         RETURNING view_count`
            );

            const FAKE_OFFSET = 12693; // Make the site look popular
            const newCount = updateResult.rows[0].view_count;

            return res.status(200).json({
                success: true,
                viewCount: newCount + FAKE_OFFSET,
                realCount: newCount
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update view count',
            details: error.message
        });
    }
};
