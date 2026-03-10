const express = require("express");
require("dotenv").config();
const app = express();
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use("/admin",adminRoute);
app.use("/user",userRoute);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})