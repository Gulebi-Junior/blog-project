const { model } = require("mongoose");
const { UserSchema } = require("./Schemas");

const UserModel = model("users", UserSchema);

module.exports = { UserModel };
