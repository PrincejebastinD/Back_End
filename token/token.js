const jwt = require('jsonwebtoken');
require('dotenv').config()

const secretkey = process.env.secretkey
const tokenexp = process.env.tokenexp

// Generate Token

function generatetoken(payload) {
    return jwt.sign(payload, secretkey,  { expiresIn: tokenexp });
}

// Verify Token

function VerifyToken(Token) {
    try {
        const decoded = jwt.verify(Token, secretkey)
        return { valid: true, decoded }
    } catch (error) {
        return { valid: false, error: error.message }
    }
}

// valid Time

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send([{status:'N',Msg:'Access denied. No token provided.'}]);
    }
    const verificationResult = VerifyToken(token,secretkey);
    if (!verificationResult.valid) {
        return res.status(403).send([{status:'N',Msg:'Invalid or expired token.'}]);
    }
    req.user = verificationResult.decoded;
    next();
}

module.exports = {
    generatetoken:generatetoken,
    authenticateToken:authenticateToken
}