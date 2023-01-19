const express = require("express");
const { PostModel, UserModel } = require("../Models");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");

        UserModel.find({}, (err, users) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success", data: users });
        });
    } catch (error) {
        console.error(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { id } = req.params;

        UserModel.findById(id, (err, user) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(200).send({ message: "Success", data: user });
        });
    } catch (error) {
        console.error(error);
    }
});

router.post("/login", (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { name, surname, login, password } = req.body;
        const newUser = new UserModel({ name, surname, login, password });

        newUser.save((err) => {
            if (err) return res.status(500).send({ message: "Error" });
            else return res.status(201).send({ message: "Success" });
        });
    } catch (error) {
        console.error(error);
    }
});

router.post("/signin", (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { login, password } = req.body;

        UserModel.findOne({ login }, (err, user) => {
            if (err) return res.status(500).send({ message: "Error" });
            else if (user === null) return res.status(404).send({ message: "Not Found" });
            else {
                if (user?.password === password) {
                    return res.status(200).send({ message: "Success", data: user._id });
                } else return res.status(400).send({ message: "Incorrect Password" });
            }
        });
    } catch (error) {
        console.error(error);
    }
});

router.post("/subscribe", async (req, res) => {
    try {
        res.set("Content-Type", "application/json");
        const { targetId, userId } = req.body;
        const user = await UserModel.findById(userId);

        if (!user.subscriptionUserIds.includes(targetId)) user.subscriptionUserIds.push(targetId);
        else user.subscriptionUserIds = user.subscriptionUserIds.filter((id) => id != targetId);

        user.save((err) => {
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
    const { name, surname, login } = req.body;

    UserModel.findByIdAndUpdate(id, { name, surname, login }, async (err, user) => {
        if (err) return res.status(500).send({ message: "Error" });
        else {
            const author = await UserModel.findById(id);
            PostModel.updateMany({ "author._id": id }, { author }, (err) => {
                if (err) return res.status(500).send({ message: "Error" });
                return res.status(200).send({ message: "Success", data: user });
            });
        }
    });
});

router.delete("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await UserModel.findByIdAndRemove(id));
});

module.exports = router;
