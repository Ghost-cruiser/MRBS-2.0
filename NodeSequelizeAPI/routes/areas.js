"use strict";

module.exports = function (router) {
  
    var models = require('../models');

    router
    
    //.param('areaId', function (req, res, next, areaId) {
    //    console.log('CALLED ONLY ONCE with', areaId);
    //    next();
    //})

    .route('/areas')
    // accessed at POST http://localhost:1337/api/Areas)
    .post(function (req, res) {
        models.Area.create({
            areaName: req.body.areaName,
        }).then(function () {
            res.json({ message: 'Area Created' });
        }).catch(function (error) {
            console.log("ops: " + error);
            res.status(500).json({ error: 'error' });
        });
    })

    .get(function (req, res) {
        console.log('Areas being getted');
        models.Area.findAll({ include: [models.Room] })
      .then(function (areas) {
            res.send(areas);
        }).catch(function (error) {
            console.log("ops: " + error);
            res.status(500).json({ error: 'error' });
        });
        
    });
};