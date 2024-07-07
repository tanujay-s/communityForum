const adminMiddleware = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};

module.exports = adminMiddleware;
