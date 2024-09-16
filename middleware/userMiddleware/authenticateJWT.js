const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        // const token = authHeader.split('.')[1];
        // console.log(token)
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token in middle are authenticateJWT' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header missing or invalid in  middle are authenticateJWT' });

    }
};

module.exports = authenticateJWT;
