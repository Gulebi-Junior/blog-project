const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/static", express.static(__dirname + "/public"));

app.use("/users", require("./routers/usersRouter"));
app.use("/posts", require("./routers/postsRouter"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI).then(
    () => {
        console.log("App has connected to MongoDB");
        app.listen(port, () => console.log(`App running at http://localhost:${port}/`));
    },
    (err) => console.error(err)
);
