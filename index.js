const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const privateMiddleware = require("./routes/private");
const postsRoute = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
}).then(result => {
    console.log("Connected to database.");
}).catch(error => {
    console.log(error);
});


app.use(express.json());

//Route middleware
app.use("/api/user", authRoute); //za registraciju i login
app.use("/api/users", usersRoute) //za vidjeti listu user-a
app.use("/api", postsRoute); //za staviti post

app.listen(3000, () => {
    console.log("Server is running.")
});
