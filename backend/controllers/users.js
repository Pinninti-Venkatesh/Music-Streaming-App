const Users = require("../models/users");
const formidable = require('formidable');
const fs = require("fs");
const logger = require("../logger/logger");

exports.getUserById = (req, res, next) => {
    Users.findById({ _id: req.params.userId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No user was found"
            });
        }
        req.user = user;
        next();
    });
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.__v = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to update"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            user.__v = undefined;
            res.json(user);
        }
    );
};

exports.updatePhoto = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, file) => {
        logger.info("album found:" + album);
        let user = {}
        user.photo.data = fs.readFileSync(file.photo.type);
        user.photo.contentType = file.photo.type;
        Users.findByIdAndUpdate({ _id: req.user._id }, user, (err, user) => {
            if (!err && user) {
                return res.status(200).json({ response: "photo updated" });
            }
            logger.error("error in updating photo:" + err);
            return res.status(500).json({ error: "unknown error occured" });
        })
    });
}

exports.resetPassword = (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    Users.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist'
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                error: 'new password does not match with confirm password'
            });
        }
        if (!user.authenticate(oldPassword)) {
            return res.status(401).json({
                error: 'wrong password'
            });
        }
        Users.findByIdAndUpdate({ _id: req.user._id }, { password: confirmPassword }, (err, user) => {
            if (!err && user) {
                return res.status(200).json({ response: "Password changed successfully" });
            }
            logger.error("error in changing password:" + err);
            return res.status(500).json({ error: "unknown error occured" });
        })
    });
}
//likes controllers
exports.addSongToLikes = (req, res, next) => {
    Users.findByIdAndUpdate({ _id: req.user._id }, { $push: { "likes.songs": req.song._id } }, (err, user) => {
        if (!err && user) {
            next();
            return;
        }
        logger.error("error in addSongToLikes:" + err);
        return res.status(500).json({ error: "unknown error occured" });
    })
}

exports.addAlbumToLikes = (req, res, next) => {
    Users.findByIdAndUpdate({ _id: req.user._id }, { $push: { "likes.albums": req.album._id } }, (err, user) => {
        if (!err && user) {
            next();
            return;
        }
        logger.error("error in addAlbumToLikes:" + err);
        return res.status(500).json({ error: "unknown error occured" });
    })
}

exports.addPlaylistToLikes = (req, res, next) => {
    Users.findByIdAndUpdate({ _id: req.user._id }, { $push: { "likes.playlists": req.playlist._id } }, (err, user) => {
        if (!err && user) {
            next();
            return;
        }
        logger.error("error in addPlaylistToLikes:" + err);
        return res.status(500).json({ error: "unknown error occured" });
    });
}

//library controllers
exports.addSongToLibrary = (req, res) => {
    Users.findByIdAndUpdate({ _id: req.user._id }, { $push: { "library.songs": req.song._id } }, (err, user) => {
        if (!err && user) {
            return res.status(200).send({ response: req.song.name + " added to songs in library" });
        };
        logger.error("error in addAlbumInLikes:" + err);
        return res.status(500).json({ error: "unknown error occured" });
    });
}

exports.addAlbumToLibrary = (req, res) => {
    Users.findByIdAndUpdate({ _id: req.user._id }, { $push: { "library.albums": req.album._id } }, (err, user) => {
        if (!err && user) {
            return res.status(200).send({ response: req.album.name + " added to albums in library" });
        };
        logger.error("error in addAlbumInLikes:" + err);
        return res.status(500).json({ error: "unknown error occured" });
    });
}

exports.addPlaylistToLibrary = (req, res) => {
    Users.findByIdAndUpdate({ _id: req.user._id }, { $push: { "library.playlists": req.playlist._id } }, (err, user) => {
        if (!err && user) {
            return res.status(200).send({ response: req.playlist.name + " added to playlists in library" });
        }
        logger.error("error in addAlbumInLikes:" + err);
        return res.status(500).json({ error: "unknown error occured" });
    });
}