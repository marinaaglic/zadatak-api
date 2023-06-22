const router = require("express").Router();
const verify = require("./private");
const User = require("../model/User");

router.get("/", verify, (req, res) => {
    return User.find().then(data => {
        res.json(data);
    });
});

module.exports = router;


