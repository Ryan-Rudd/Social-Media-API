const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Post model
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    sharedPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Automatically update the `updatedAt` field on every save
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Post model using the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
