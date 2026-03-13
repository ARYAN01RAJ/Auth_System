const jwt = require("jsonwebtoken")
const jwtPassword = process.env.JWT_SECRET;

async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(401).json({
            msg: "Authorization header missing"
        });
    }

    const token = auth.split(" ")[1];
    try{
        const decoded = jwt.verify(token,jwtPassword);
        req.admin = decoded;
        next();
    }catch{
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {adminMiddleware}