const { Schema } = require("mongoose");

const UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    login: { type: String },
    password: { type: String },
    likedPosts: { type: [], default: [] },
});

module.exports = { UserSchema };
