"use strict";

module.exports = function (router) {
  
    var models = require('../models');

    router
    //.param('areaId', function (req, res, next, areaId) {
    //    req.users = models.User.findAll({ where : { AreaId: areaId } })
    //    req.areaId = areaId;
        
    //    next();
    //})
    
    //.route('/rooms')

    // accessed at POST http://localhost:1337/api/rooms)
    .post('/rooms', function (req, res, next) {
        models.Room.create({
            AreaId: req.body.AreaId,
            roomName: req.body.roomName,
            roomDescription: req.body.roomDescription,
            capacity: req.body.capacity,
            priceForALeague: req.body.priceForALeague,
            priceForAClub: req.body.priceForAClub,
            priceForAPerson: req.body.priceForAPerson
        }).then(function () {
            res.json({ message: 'Room Created' });
        }).catch(function (error) {
            console.log("ops: " + error);
            res.status(500).json({ error: 'error' });
        });

        //next();
    })
};