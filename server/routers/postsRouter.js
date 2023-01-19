const express = require("express");
const { PostModel, UserModel } = require("../Models");

const router = express.Router();

router.get("/get/:skip", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { skip } = req.params;

        PostModel.find({}, (err, posts) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success", data: posts });
        })
            .skip(Number(skip))
            .limit(10);
    } catch (error) {
        console.error(error);
    }
});

router.get("/count", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");

        PostModel.count({}, (err, count) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success", data: count });
        });
    } catch (error) {
        console.error(error);
    }
});

router.get("/byId/:id", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { id } = req.params;

        PostModel.findById(id, (err, post) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success", data: post });
        });
    } catch (error) {
        console.error(error);
    }
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
    try {
        res.set("Content-Type", "application/json");
        const { title, description, tags, body, authorId } = req.body;
        const author = await UserModel.findById(authorId);
        const newPost = new PostModel({ title, description, tags, body, author });

        newPost.save((err) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(201).send({ message: "Success" });
        });
    } catch (error) {
        console.error(error);
    }
});

router.put("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;
    const { title, description, tags, body } = req.body;

    PostModel.findByIdAndUpdate(id, { title, description, tags, body }, (err, post) => {
        if (err) return res.status(500).send({ message: "Error" });
        else return res.status(200).send({ message: "Success", data: post });
    });
});

router.post("/like", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { postId, userId } = req.body;
        const post = await PostModel.findById(postId);

        if (!post.userIdsLiked.includes(userId)) post.userIdsLiked.push(userId);
        else post.userIdsLiked = post.userIdsLiked.filter((id) => id != userId);

        post.save((err) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(201).send({ message: "Success" });
        });
    } catch (error) {
        console.error(error);
    }
});

router.post("/filter", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { login, title, hashtag, onlySubs, userId } = req.body;

    const arr = [
        { title: { $regex: new RegExp(title) } },
        { "author.login": { $regex: new RegExp(login) } },
        { tags: { $elemMatch: { $regex: new RegExp(hashtag) } } },
    ];

    if (onlySubs) {
        const user = await UserModel.findById(userId);
        arr.push({ "author._id": { $in: user.subscriptionUserIds } });
    }

    PostModel.find({ $and: arr }, (err, posts) => {
        if (err) return res.status(500).send({ message: "Error" });
        else return res.status(200).send({ message: "Success", data: posts });
    });
});

router.delete("/:id", (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { id } = req.params;

        PostModel.findByIdAndRemove(id, (err) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success" });
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
