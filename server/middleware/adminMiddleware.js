const { auth } = require('./authMiddleware');

const admin = (req, res, next) => {
    auth(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ msg: 'Forbidden: Access is denied.' });
        }
    });
};

module.exports = admin; 