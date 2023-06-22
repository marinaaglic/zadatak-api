const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../model/User");

router.post("/register", async (req, res) => {

    const { email, password, firstName, lastName, role } = req.body;
    if (!(email && password && firstName && lastName)) {
        res.status(400).send("All input fields are required.");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
        return res.status(400).send("User already exists. Please login.");
    }
    const salt = 10 // arbitrary
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        email,
        password: hashPassword,
        firstName,
        lastName,
        role
    });

    try {
        await user.save();
        const token = jwt.sign({ email, role: user.role }, process.env.TOKEN_KEY, { expiresIn: "2h" });
        res.send({
            message: "You are now registered.",
            token: token
        });

    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!(email && password)) {
        res.status(400).send("All input is required.");
    }

    const user = await User.findOne({ email });


    if (user && (await bcrypt.compare(password, user.password))) {
        const tokenPayload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
        const token = jwt.sign(tokenPayload, process.env.TOKEN_KEY, { expiresIn: "2h" });
        res.header("Authorization", token).send({ message: "Logged in.", token: token });
    } else {
        res.status(400).send("Invalid e-mail or password.");
    }
})

module.exports = router;