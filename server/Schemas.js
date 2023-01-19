const { Schema } = require("mongoose");

const UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    login: { type: String },
    password: { type: String },
    subscriptionUserIds: { type: [String], default: [] },
});

const PostSchema = new Schema({
    title: { type: String },
    tags: { type: [String] },
    body: { type: String },
    image: { type: String },
    author: { type: UserSchema },
    userIdsLiked: { type: [String], default: [] },
});

module.exports = { UserSchema, PostSchema };
