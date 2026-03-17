const Router = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User } = require("../db");
const { sendEmail } = require("../services/emailService");
const { userMiddleware } = require("../middleware/userMiddleware");
const jwtPassword = process.env.USER_JWT_SECRET;


router.post("/signup", async (req,res)=>{
    const {email,password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(409).json({
            msg: "User already exist"
        })
    }

    const hash = await bcrypt.hash(password,10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const link = `http://localhost:3000/user/verify-email?token=${verificationToken}`;

    const user = new User({
        email: email,
        password: hash,
        verificationToken: verificationToken,
        isVerified: false,
        resetToken: null
    });
    await user.save();

    await sendEmail(
        email,
        "verify your email",
        `Click on this link to verify your email - ${link}`
    );
    res.status(200).json({
        msg: "account created successfully, check your mail and verify your account"
    });
})

router.get("/verify-email",async (req,res)=>{
    const token = req.query.token;

    const user = await User.findOne({verificationToken:token});
    if(user){
        user.verificationToken = null;
        user.isVerified = true;
        await user.save();
        res.status(200).json({
            msg: "verification successfull"
        })
    }else{
        res.status(400).json({
            msg: "Invalid or expired token"
        })
    }
})

router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            msg: "Account does not exist"
        })
    }
    if(!user.isVerified){
        return res.status(403).json({
            msg: "Your Account is not verified, Please open your mail and then login again"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({
            msg: "Wrong Password"
        })
    }

    const token = jwt.sign(
        {userId: user._id},
        jwtPassword,
        {expiresIn: "5m"}
    )
    res.status(200).json({token})
})

router.get("/profile", userMiddleware ,async (req,res)=>{
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            msg: "User does not exist"
        })
    }
    res.status(200).json({
        email: user.email,
        msg:"your account is verified"
    })
})

router.post("/forgot-password",async (req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            msg: "User does not exist"
        });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const link = `http://localhost:3000/user/reset-password?token=${resetToken}`;
    user.resetToken = resetToken;
    await user.save();
    await sendEmail(
        email,
        "Reset Password request",
        `Click on this link to reset your password - ${link}`
    )
    res.status(200).json({
        msg: "Check your email for reset password link"
    });
})

router.post("/reset-password",async (req,res)=>{
    const {token} = req.query;
    const password = req.body.password;
    if(!password){
        return res.status(400).json({
            msg: "No password given. Give the updated password"
        })
    }
    const hash = await bcrypt.hash(password,10);
    const user = await User.findOne({resetToken: token});
    if(user){
        user.password = hash;
        user.resetToken = null;
        await user.save();
        res.status(200).json({
            msg: "Your Password has been reset"
        });
    }else{
        res.status(400).json({
            msg: "User does not exist or wrong token"
        });
    }
})

module.exports = router;