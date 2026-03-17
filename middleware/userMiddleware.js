const jwt = require("jsonwebtoken");
const jwtPassword = process.env.USER_JWT_SECRET

async function userMiddleware(req,res,next){
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(401).json({
            msg: "Authorization header is missing"
        })
    }

    const token = auth.split(" ")[1];
    try{
        const decoded = jwt.verify(token,jwtPassword);
        req.user = decoded;
        next();
    }catch{
        res.status(401).json({
            msg:"Invalid or expired token, login again"
        })
    }
}



module.exports = {userMiddleware}