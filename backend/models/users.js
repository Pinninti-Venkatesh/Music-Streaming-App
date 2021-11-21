//const { truncate } = require("lodash");
var mongoose = require("mongoose");
const crypto = require("crypto");
const { uuid } = require("uuidv4");
const { ObjectId } = mongoose.Schema;
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    dob: Date,
    age: Number,
    gender: {
      type: String,
      maxlength: 1
    },
    listen: {
      songs: [{ id: String, count: Number }],
      albums: [{ id: String, count: Number }],
      playlists: [{ id: String, count: Number }],
    },
    likes: {
      songs: [{ type: ObjectId, ref: "songs" }],
      albums: [{ type: ObjectId, ref: "albums" }],
      playlists: [{ type: ObjectId, ref: "playlists" }],
    },
    library: {
      songs: [{ type: ObjectId, ref: "songs" }],
      albums: [{ type: ObjectId, ref: "albums" }],
      playlists: [{ type: ObjectId, ref: "playlists" }],
    },
    photo: {
      data: Buffer,
      contentType: String,
  },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
);
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password; //here _password is virtual,it does not exist in the document but it can always be obtained using the get method
    this.salt = uuid();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });
userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },
  securePassword: function (plainpassword) {
    if (!plainpassword) return true;
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
