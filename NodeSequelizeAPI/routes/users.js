"use strict";


module.exports = function (router) {
    
    var models = require('../models');
    
    router
    //.param('username', function (req, res, next, userid) {
    //    req.user = models.User.findOne({ where : { username: username } })
    //    req.username = username;
    //})
    
        .route('/authenticate')
            .post(function (req, res) {
            models.User.findOne({ where : { username: req.body.username } })
                    .then(function (user) {
                if (user.password === req.body.password) {
                    res.json({ success: true });
                }
            else {
                res.json({ message: 'Le nom d\'utilisateur ou le mot de passe est incorrect' });
            }
        })
                .catch(function (error) {
            console.log('erreur');
                res.json({ message: 'Le nom d\'utilisateur ou le mot de passe est incorrect' });
        })
    });
}
    
    
//        .route('/users')
    
//    .get(function (req, res) {
//        models.User.findAll()
//          .then(function (users) {
//            res.render('index', {
//                title: 'Express',
//                users: users
//            });
//        }).catch(function (error) {
//            console.log("ops: " + error);
//            res.status(500).json({ error: 'error' });
//        });
//    })
     
//    //.get('/:userid', function (req, res, next) {
//    //    req.user.exec(function (err, user) {
//    //        if (err) { return next(err); }
//    //    res.render('user', { user: user });
//    //})
//    //})

//    .get('/:username', function (req, res, username) {
//        //models.User.findOne({ where : { username: username } })
//        //     .then(function (user) {
//        //    res.send(user);
//        //}).catch(function (error) {
//        //    console.log("ops: " + error);
//        //    res.status(500).json({ error: 'error' });
//        //});
//        req.user.exec(function (err, user) {
//            if (err) { return next(err); }
//            res.send({ user: user });
//        })

//      .post(function (req, res) {
//            models.Area.create({
//                areaName: req.body.areaName,
//            }).then(function (areas) {
//                res.json(areas.dataValues);
//            }).catch(function (error) {
//                console.log("ops: " + error);
//                res.status(500).json({ error: 'error' });
//            });
//        })
//    });
//};

//router.get('/', function (req, res, next) {
//    res.render('render data');
//});

//router.param('userid', function (req, res, next, userid) {
//    req.user = User.findById(userid);
//    req.userid = userid;
//});

//router.get('/:userid', function (req, res, next) {
//    req.user.exec(function (err, user) {
//        if (err) { return next(err); }
//        res.render('user', { user: user });
//    });
//});

//router.put('/:userid', function (req, res, next) {
//    User.findByIdAndUpdate(req.userid, req.body, function (err) {
//        if (err) { return next(err); }
//        res.render('user-updated');
//    });
//});

//router.delete('/:userid', function (req, res, next) {
//    User.findByIdAndDelete(req.userid, function (err) {
//        if (err) { return next(err); }
//        res.render('user-deleted');
//    });
//});

//module.exports = router;
