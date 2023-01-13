const express = require("express");
const { PostModel, UserModel } = require("../Models");

const router = express.Router();

router.get("/", async (req, res) => {
    res.set("Content-Type", "application/json");

    res.send(await PostModel.find({}));
});

router.get("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await PostModel.findById(id));
});

router.post("/", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { title, description, tags, body, authorId } = req.body;
    const author = await UserModel.findById(authorId);
    const newPost = new PostModel({ title, description, tags, body, author });

    res.send(await newPost.save());
});

router.delete("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await PostModel.findByIdAndRemove(id));
});

module.exports = router;
