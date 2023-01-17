const express = require("express");
const { UserModel } = require("../Models");

const router = express.Router();

router.get("/", async (req, res) => {
    res.set("Content-Type", "application/json");

    UserModel.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: "Error" });
        else return res.status(200).send({ message: "Success", data: users });
    });
});

router.get("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    UserModel.findById(id, (err, user) => {
        if (err) return res.status(500).send({ message: "Error" });
        else return res.status(200).send({ message: "Success", data: user });
    });
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

        if (!user.subscribedUsersIds.includes(targetId)) user.subscribedUsersIds.push(targetId);
        else user.subscribedUsersIds = user.subscribedUsersIds.filter((id) => id != targetId);

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
    const { name, surname, login, password } = req.body;
    const user = await UserModel.findById(id);

    Object.assign(user, { name, surname, login, password });

    res.send(await user.save());
});

router.delete("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await UserModel.findByIdAndRemove(id));
});

module.exports = router;
