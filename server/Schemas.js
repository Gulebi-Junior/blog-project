const { Schema } = require("mongoose");

const UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    login: { type: String },
    password: { type: String },
    // likedPosts: { type: [PostSchema], default: [] },
});

const PostSchema = new Schema({
    title: { type: String },
    description: { type: String },
    tags: { type: [String] },
    body: { type: String },
    author: { type: UserSchema },
    // likes: { type: Number },
    usersLiked: { type: [UserSchema] },
});

module.exports = { UserSchema, PostSchema };
