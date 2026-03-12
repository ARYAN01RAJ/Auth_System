const Router = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../db");
const jwtPassword = process.env.JWT_SECRET;
const { sendEmail } = require("../services/emailService");
const crypto = require("crypto");


router.post("/signup", async (req,res)=>{
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password,10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const link = `http://localhost:3000/admin/verify-email?token=${verificationToken}`;
  const admin = new Admin({
    email,
    password: hash,
    verificationToken,
    isVerified: false
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
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);//it, converts the given password and converts it into hash behind the table and compares and then returns a boolean value.
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }
  if (!user.isVerified) {
    return res.status(403).json({
      message: "Please verify your email"
    });
  }
  const token = jwt.sign(
    { email: email },
    jwtPassword,
    { expiresIn: "1m" }
  );
  res.status(200).json({ token });

});


module.exports = router;