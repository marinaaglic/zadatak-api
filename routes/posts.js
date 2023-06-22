const router = require("express").Router();
const verify = require("./private");
const Post = require("../model/Post");
const User = require("../model/User");

router.post("/posts", verify, async (req, res) => {
    const { title, content } = req.body;
    const allowed = req.user.role === "ADMIN";
    const author = `${req.user.firstName} ${req.user.lastName}`;
    const post = new Post({
        title,
        content,
        author,
        allowed
    });

    try {
        await post.save();
        res.status(200).send("Post has been sent.");
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.get("/post-request", verify, async (req, res) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).send("You don't have the rights to view this data.");
    }
    try {
        const posts = await Post.find({ allowed: false });
        res.json(posts);
    }
    catch (err) {
        res.status(500).send(err);
    }

});

router.post("/post-request", verify, async (req, res) => {

    if (req.user.role !== "ADMIN") {
        return res.status(403).send("You don't have the rights to change this data.");
    }
    try {
        const { postId, allowed } = req.body;
        const post = await Post.findByIdAndUpdate(postId, { allowed }, { new: true });
        if (!post) {
            return res.status(404).send("Post not found.");
        }
        if (allowed) {
            const [firstName, lastName] = post.author.split(" ");
            const user = await User.findOne({ firstName, lastName });

            if (!user) {
                return res.status(404).send("User not found.");
            }
            await User.findByIdAndUpdate(user._id, { role: "BLOGGER" }, { new: true });
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

router.get("/posts", verify, async (req, res) => {
    try {
        if (req.user.role === "ADMIN") {
            Post.find({}).then(data => {
                res.json(data);
            })
        } else if (req.user.role === "BLOGGER") {
            const author = `${req.user.firstName} ${req.user.lastName}`;
            Post.find({ author }).then(data => {
                res.json(data);
            });
        } else if (!req.user) {
            Post.find({ allowed: true }).then(data => {
                res.json(data);
            });
        }

    }
    catch (err) {
        console.log("ERR", err)
        res.status(500).send(err);
    }

});

module.exports = router;