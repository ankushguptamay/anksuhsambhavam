const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('JWT Verif MW');
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.user = decoded;
        next();
    });
};

const authJwt = {
    verifyJWT: verifyJWT
};
module.exports = authJwt;