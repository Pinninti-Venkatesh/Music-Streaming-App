const mongoose = require('mongoose');
const { ObjectId }=mongoose.Schema;
var playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        maxlength: 100,
        minlength: 3
    },
    owner_id:String,
    public:{
        type:Boolean,
        default:true
    },
    songs: [{ type: ObjectId, ref: "songs" }],
    likes: {
        type: Number,
        min: 0,
        default:0
    },
    plays: {
        type: Number,
        min: 0,
        default:0
    }
});

module.exports = mongoose.model("playlists", playlistSchema);