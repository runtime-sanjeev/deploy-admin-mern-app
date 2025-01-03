const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).send({ message: 'No token provided.'});
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send({message: 'Unauthorized, Wrong token'});
    }
}
module.exports = ensureAuthenticated;