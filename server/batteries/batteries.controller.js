(function () {
    'use strict';

    var data = [
        {
            id: 1,
            name: '#1 ONBO 3S 1350mAh 20C',
            cycles: 14
        },
        {
            id: 2,
            name: '#2 ONBO 3S 1350mAh 20C',
            cycles: 13
        },
        {
            id: 3,
            name: '#1 Fatshark 2s 1000mAh',
            cycles: 7
        }
    ];

    var BatteriesController = {

        init: function (req, res, next) {
            console.log('batteriesController.init');
            next();
        },

        get: function (req, res, next) {
            console.log('batteriesController.get');

            res.send(data);
        }
    }

    module.exports = BatteriesController;

} ());