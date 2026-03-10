const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
require("dotenv").config();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use("/admin",adminRoute);
app.use("/user",userRoute);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})