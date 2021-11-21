const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
var songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 3,
        unique:true
    },
    artist: {
        type: String,
        maxlength: 100,
        minlength: 3
    },
    album: {
        type: ObjectId,
        ref: "albums",
    },
    likes: {
        type: Number,
        min: 0,
        default:0
    },
    plays: {
        type: Number,
        min: 0,
        default:0
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    file:{
        data: Buffer,
        contentType: String,
    }
});

module.exports=mongoose.model("songs",songSchema);