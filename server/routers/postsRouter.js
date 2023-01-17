const express = require("express");
const { PostModel, UserModel } = require("../Models");

const router = express.Router();

router.get("/", async (req, res) => {
    res.set("Content-Type", "application/json");

    res.send(await PostModel.find({}));
});

router.get("/byId/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await PostModel.findById(id));
});

router.get("/byUserId/:userId", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { userId } = req.params;

        PostModel.find({ "author._id": userId }, (err, posts) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success", data: posts });
        });
    } catch (error) {
        console.error(error);
    }
});

router.post("/", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { title, description, tags, body, authorId } = req.body;
    const author = await UserModel.findById(authorId);
    const newPost = new PostModel({ title, description, tags, body, author });

    res.send(await newPost.save());
});

router.post("/like", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { postId, userId, liked } = req.body;
        const post = await PostModel.findById(postId);

        if (liked) post.usersIdsLiked.push(userId);
        else post.usersIdsLiked = post.usersIdsLiked.filter((id) => id != userId);

        post.save((err) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(201).send({ message: "Success" });
        });
    } catch (error) {
        console.error(error);
    }
});

router.delete("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await PostModel.findByIdAndRemove(id));
});

module.exports = router;
