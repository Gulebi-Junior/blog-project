const express = require("express");
const { UserModel } = require("../Models");

const router = express.Router();

router.get("/", async (req, res) => {
    res.set("Content-Type", "application/json");

    res.send(await UserModel.find({}));
});

router.get("/:id", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { id } = req.params;

    res.send(await UserModel.findById(id));
});

router.post("/", async (req, res) => {
    res.set("Content-Type", "application/json");
    const { name, surname, login, password } = req.body;
    const newUser = new UserModel({ name, surname, login, password });

    res.send(await newUser.save());
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
