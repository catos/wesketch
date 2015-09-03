var mongoose = require('mongoose'),
    encrypt = require('../blocks/encryption');

var userSchema = mongoose.Schema({
    firstName: { type: String, required: '{PATH} is required!' },
    lastName: { type: String, required: '{PATH} is required!' },
    username: {
        type: String,
        required: '{PATH} is required!',
        unique: true
    },
    salt: { type: String, required: '{PATH} is required!' },
    password: { type: String, required: '{PATH} is required!' },
    roles: [String]
});

userSchema.methods = {
    authenticate: function (passwordToMatch) {
        return encrypt.hashPassword(this.salt, passwordToMatch) === this.password;
    },
    hasRole: function (role) {
        return this.roles.indexOf(role) > -1;
    }
};

module.exports = mongoose.model('User', userSchema);

// var User = mongoose.model('User', userSchema);

// exports.seedUsers = seedUsers;

// function seedUsers() {
//     User.find({}).exec(function (err, collection) {
//         if (collection.length === 0) {
//             var salt, hash;
//             salt = encrypt.createSalt();
//             hash = encrypt.hashPassword(salt, 'cato');
//             User.create({ firstName: "Cato", lastName: "Skogholt", username: "cato", salt: salt, password: hash, roles: ['admin'] }),

//             salt = encrypt.createSalt();
//             hash = encrypt.hashPassword(salt, 'test');
//             User.create({ firstName: "Test", lastName: "Bruker", username: "test", salt: salt, password: hash, roles: [] }),

//             salt = encrypt.createSalt();
//             hash = encrypt.hashPassword(salt, 'kim');
//             User.create({ firstName: "Kim", lastName: "Blix", username: "kim", salt: salt, password: hash, roles: [] })
//         }
//     });
// };