// Função serverless da Vercel: GET /api/status
module.exports = (req, res) => {
    res.status(200).json({ status: 'online', timestamp: new Date().toISOString() });
};
