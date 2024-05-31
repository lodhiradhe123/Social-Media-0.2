const mongoose = require("mongoose");

const postSchema = mongoose.Schema({

        title: {
            type: String,
            trim: true,
            required: [true, "Title is required"],
            minLength: [4, "Title must be atleast 4 characters long"],
        },
        media: {
            type: String,
            required: [true, "Media is required"],
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    }, { timestamps: true },)
    // timestamp is used for geting time of creating post 😊
 
module.exports= mongoose.model("post", postSchema);
