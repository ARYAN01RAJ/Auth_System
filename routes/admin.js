const Router = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin, User } = require("../db");
const jwtPassword = process.env.JWT_SECRET;
const { sendEmail } = require("../services/emailService");
const crypto = require("crypto");
const { adminMiddleware } = require("../middleware/adminMiddleware");


router.post("/signup", async (req,res)=>{
  const { email, password } = req.body;
  const existingUser = await Admin.findOne({email});
  if(existingUser){
    return res.status(409).json({
      msg: "Admin already exist"
    });
  }
  const hash = await bcrypt.hash(password,10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const link = `http://localhost:3000/admin/verify-email?token=${verificationToken}`;
  const admin = new Admin({
    email,
    password: hash,
    verificationToken,
    isVerified: false,
    resetToken: null
  });
  
  await admin.save();
  await sendEmail(
    email,
    "verify-email",
    `Click this link to verify account ${link}`
  );
  res.status(200).json({
    msg: "Signup successful. Check your email."
  });
});

router.get("/verify-email", async (req, res)=>{
  const verificationToken = req.query.token;
  const admin = await Admin.findOne({verificationToken: verificationToken});
  if(admin){
    admin.isVerified = true
    admin.verificationToken = null
    await admin.save();
    res.status(200).json({
      msg: "Account verified successfully"
    });
  }else{
    res.status(400).json({
      msg: "Invalid or expired token"
    })
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, admin.password);//it, converts the given password and converts it into hash behind the table and compares and then returns a boolean value.
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }
  if (!admin.isVerified) {
    return res.status(403).json({
      message: "Please verify your email"
    });
  }
  const token = jwt.sign(
    { adminId: admin._id },
    jwtPassword,
    { expiresIn: "5m" }
  );
  res.status(200).json({ token });

});

router.post("/forgot-password", async (req,res)=>{
  const { email } = req.body;
  const admin = await Admin.findOne({email: email});
  if(!admin){
    return res.status(404).json({
      msg: "Admin does not exist"
    });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const link = `http://localhost:3000/admin/reset-password?token=${resetToken}`;
  admin.resetToken = resetToken;
  await admin.save();
  await sendEmail(
    email,
    "reset password",
    `Click this link to reset password ${link}`
  )
  res.status(200).json({
    msg: "check your mail for reset link"
  });
})

router.post("/reset-password", async (req,res)=>{
  const resetToken = req.query.token;
  const password = req.body.password;
  if(!password){
    return res.status(400).json({
      msg: "No password given. Give the updated password"
    })
  }
  const hash = await bcrypt.hash(password,10);
  const admin = await Admin.findOne({resetToken: resetToken});
  if(admin){
    admin.password = hash;
    admin.resetToken = null;
    await admin.save();
    res.status(200).json({
      msg: "Password updated successfully"
    })
  }else{
    res.status(400).json({
      msg: "User does not exist"
    });
  }
})

router.get("/profile",adminMiddleware,async (req,res)=>{
  const adminId = req.admin.adminId;

  const admin = await Admin.findById(adminId);
  if(!admin){
    return res.status(404).json({
      msg: "Admin does not exist"
    })
  }

  res.json({
      email: admin.email,
      message: "You are authenticated"
  });
})


module.exports = router;