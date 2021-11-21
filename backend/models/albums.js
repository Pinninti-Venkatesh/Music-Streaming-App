const mongoose = require('mongoose');

var albumSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength: 100,
        minlength: 3,
        unique:true,
    },
    likes: {
        type: Number,
        min: 0
    },
    plays: {
        type: Number,
        min: 0
    }
});

module.exports=mongoose.model("albums",albumSchema);