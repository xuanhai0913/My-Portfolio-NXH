module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(410).json({
        success: false,
        error: 'endpoint_retired',
        message: 'This endpoint has been retired.',
    });
};
