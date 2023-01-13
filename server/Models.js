const { model } = require("mongoose");
const { UserSchema, PostSchema } = require("./Schemas");

const UserModel = model("users", UserSchema);
const PostModel = model("posts", PostSchema);

module.exports = { UserModel, PostModel };
