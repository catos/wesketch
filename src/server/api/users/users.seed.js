var User = require('./users.model');

module.exports = function () {

    User.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            seedUsers();
        }
    });

    function seedUsers() {
        console.log('Seeding users...');
        
        var users = [
            { name: 'Test Bruker', email: 'test@test.com', password: 'test' },
            { name: 'Cato Skogholt', email: 'cskogholt@gmail.com', password: 'monzter1', isAdmin: true },
            { name: 'Kim Robert Blix', email: 'kim.robert.blix@gmail.com', password: 'stortiss', isAdmin: true },
            { name: 'Espen Breivik', email: 'espen.breivik@gmail.com', password: 'stortiss', isAdmin: true },
        ];

        users.forEach(function (user, index) { 

            var newUser = new User(user);

            newUser.save(function (err) { 
                if (err) {
                    console.log(err.message);
                }
                console.log('User ' + user.name + ' created.');
            });
        });

    }
};