"use strict";

module.exports = function (router) {
    
    var models = require('../models');
    
    router
    .post('/entries/dateStart/dateEnd/room/:RoomId', function (req, res) {
        console.log('Getting entries by room');
        models.Entry.findAll({
            where : {
                RoomId: req.params.RoomId,

                DateStart: {
                    $between: [
                        req.body.dateStart, 
                        req.body.dateEnd
                    ]
                }

            }
        }).then(function (entries) {
            res.send(entries);
        }).catch(function (error) {
            console.log("ops: " + error);
            res.status(500).json({ error: 'error' });
        });
    })

    .post('/entries/dateStart/dateEnd/rooms', function (req, res) {
        console.log('Getting entries by date');
        models.Entry.findAll( {
            where :{
                DateStart: {
                    $between: [
                        req.body.dateStart, 
                        req.body.dateEnd
                    ]
                },

                RoomId: { $in: req.body.rooms }
            }
        }).then(function (entries) {
            res.send(entries);
        }).catch(function (error) {
            console.log("ops: " + error);
            res.status(500).json({ error: 'error' });
        });
    })
    .post('/entries', function (req, res) {
                    // Creates several instances at once
        models.Entry.bulkCreate(
                // Must be array
            req.body
        ).then(function () {
            res.json({success: true, message: 'Entry Created' });
        }).catch(function (error) {
            console.log("ops: " + error);
            res.status(500).json({ error: 'error' });
        });
    })





    
};