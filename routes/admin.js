const Router = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { Admin } = require("../db");
const jwtPassword = 'hello';


router.post("/signup", async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const hash = await bcrypt.hash(password,10);//this hashesh the password and then we store it in db.
    const user = new Admin({
        email: email,
        password: hash
    })
    await user.save();
    res.json({
        msg: "Admin created successfully"
    })
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
  const token = jwt.sign(
    { email: email },
    jwtPassword,
    { expiresIn: "1h" }
  );
  res.json({ token });

});


module.exports = router;