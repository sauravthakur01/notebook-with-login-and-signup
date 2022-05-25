const jwt = require('jsonwebtoken');
const JWT_SECRET  = 'ilovecoding';

const fetchuser = (req ,res , next) => {
    const token = req.header('token');
    if(!token){
        req.status(401).send({error: "Please authenticate using valid token "})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: "PLease authenticate using a valid token"})
    }
}

module.exports = fetchuser ; 