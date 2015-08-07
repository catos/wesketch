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
            console.log('batteriesController.init: %s %s %s', req.method, req.url, req.path);
            next();
        },

        get: function (req, res, next) {
            res.send(data);
        },

        put: function (req, res, next) {
            res.send('batteriesController.put');
        },

        post: function (req, res, next) {
            //res.json(req.body);
            var newBattery = {
                id: 4,
                name: '#2 Fatshark 2s 1000mAh',
                cycles: 3
            };
            data.push(newBattery);
            
            res.send(newBattery);
        },

        delete: function (req, res, next) {
            res.send('batteriesController.delete')
            next();
        },

    }

    module.exports = BatteriesController;

} ());